import { leerToken } from '../features/auth/tokenStorage'
import type { ErrorApiCuerpo } from './tipos'

/**
 * Cliente HTTP único de la aplicación: es la única pieza que conoce la URL de la API,
 * añade el JWT y traduce los errores del backend a {@link ApiError}.
 */
export const API_URL: string = import.meta.env.VITE_API_URL ?? 'http://localhost:8090'

export class ApiError extends Error {
  status: number
  detalles: string[]

  constructor(status: number, mensaje: string, detalles: string[] = []) {
    super(mensaje)
    this.name = 'ApiError'
    this.status = status
    this.detalles = detalles
  }
}

type ValorParametro = string | number | boolean | null | undefined

interface Opciones {
  method?: 'GET' | 'POST'
  body?: unknown
  /** Parámetros de consulta; los vacíos o indefinidos se omiten. */
  params?: Record<string, ValorParametro>
  /** false para rutas públicas (login, registro): no envía el token. */
  conAuth?: boolean
  signal?: AbortSignal
}

let manejadorNoAutorizado: (() => void) | null = null

/** La sesión registra aquí qué hacer cuando el servidor responde 401 a una petición con token. */
export function registrarManejadorNoAutorizado(manejador: (() => void) | null): void {
  manejadorNoAutorizado = manejador
}

export function construirUrl(ruta: string, params?: Opciones['params']): URL {
  const url = new URL(ruta, API_URL)
  for (const [clave, valor] of Object.entries(params ?? {})) {
    if (valor !== undefined && valor !== null && valor !== '') {
      url.searchParams.set(clave, String(valor))
    }
  }
  return url
}

export function cabeceras(conAuth: boolean, conCuerpo: boolean): Record<string, string> {
  const headers: Record<string, string> = {}
  if (conCuerpo) headers['Content-Type'] = 'application/json'
  const token = conAuth ? leerToken() : null
  if (token) headers.Authorization = `Bearer ${token}`
  return headers
}

/** Convierte una respuesta no exitosa en un {@link ApiError}, y cierra la sesión si el token ya no vale. */
export async function errorDeRespuesta(respuesta: Response, teniaToken: boolean): Promise<ApiError> {
  let cuerpo: Partial<ErrorApiCuerpo> = {}
  try {
    cuerpo = (await respuesta.json()) as Partial<ErrorApiCuerpo>
  } catch {
    // La respuesta no era JSON: se usa un mensaje genérico.
  }
  if (respuesta.status === 401 && teniaToken) {
    manejadorNoAutorizado?.()
  }
  return new ApiError(
    respuesta.status,
    cuerpo.mensaje ?? `Error ${respuesta.status} del servidor.`,
    cuerpo.detalles ?? [],
  )
}

export function errorDeRed(): ApiError {
  return new ApiError(0, 'No se pudo conectar con el servidor. ¿Está en marcha la API?')
}

export async function peticion<T>(ruta: string, opciones: Opciones = {}): Promise<T> {
  const { method = 'GET', body, params, conAuth = true, signal } = opciones
  const headers = cabeceras(conAuth, body !== undefined)

  let respuesta: Response
  try {
    respuesta = await fetch(construirUrl(ruta, params), {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error
    throw errorDeRed()
  }

  if (!respuesta.ok) {
    throw await errorDeRespuesta(respuesta, 'Authorization' in headers)
  }
  return (await respuesta.json()) as T
}

/** Mensaje y detalles listos para mostrar al usuario, venga el error de donde venga. */
export function describirError(error: unknown): { mensaje: string; detalles: string[] } {
  if (error instanceof ApiError) return { mensaje: error.message, detalles: error.detalles }
  return { mensaje: 'Ocurrió un error inesperado.', detalles: [] }
}
