import { ApiError, cabeceras, construirUrl, errorDeRed, errorDeRespuesta, peticion } from '../../api/client'
import type { Conversacion, Mensaje } from '../../api/tipos'

const BASE = '/api/chat/conversaciones'

/** Acceso HTTP al chat. La respuesta del asistente llega por streaming (ver {@link enviarEnStreaming}). */
export const chatApi = {
  listar: (signal?: AbortSignal) => peticion<Conversacion[]>(BASE, { signal }),

  crear: (titulo?: string) => peticion<Conversacion>(BASE, { method: 'POST', body: { titulo } }),

  historial: (id: string, signal?: AbortSignal) => peticion<Mensaje[]>(`${BASE}/${id}/mensajes`, { signal }),
}

/**
 * Envía un mensaje y entrega la respuesta trozo a trozo mediante `onTrozo`.
 *
 * `EventSource` no sirve aquí (solo hace GET y no admite cabecera Authorization), así que se lee el
 * cuerpo SSE del `fetch` con un `ReadableStream` y se interpreta el formato a mano.
 */
export async function enviarEnStreaming(
  id: string,
  contenido: string,
  onTrozo: (trozo: string) => void,
  signal?: AbortSignal,
): Promise<void> {
  const headers = { ...cabeceras(true, true), Accept: 'text/event-stream' }

  let respuesta: Response
  try {
    respuesta = await fetch(construirUrl(`${BASE}/${id}/mensajes/stream`), {
      method: 'POST',
      headers,
      body: JSON.stringify({ contenido }),
      signal,
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error
    throw errorDeRed()
  }

  // Errores previos al stream (404, 503 si Ollama no responde…) llegan como JSON normal.
  if (!respuesta.ok) throw await errorDeRespuesta(respuesta, true)
  if (!respuesta.body) throw errorDeRed()

  const lector = respuesta.body.pipeThrough(new TextDecoderStream()).getReader()
  let pendiente = ''
  let completa = false

  /** Procesa un evento. Lanza si el servidor informó un fallo a mitad de respuesta. */
  const procesar = (evento: string) => {
    const { nombre, datos } = interpretar(evento)
    if (nombre === 'fin') completa = true
    else if (nombre === 'error') throw new ApiError(502, datos || MENSAJE_CORTE)
    else if (datos !== null) onTrozo(datos)
  }

  try {
    for (;;) {
      const { done, value } = await lector.read()
      if (done) break
      pendiente += value
      // Los eventos se separan con una línea en blanco.
      const eventos = pendiente.split(/\r?\n\r?\n/)
      pendiente = eventos.pop() ?? ''
      for (const evento of eventos) procesar(evento)
    }
    if (pendiente.trim()) procesar(pendiente)
  } catch (error) {
    if (error instanceof ApiError) throw error
    if (error instanceof DOMException && error.name === 'AbortError') throw error
    throw new ApiError(0, MENSAJE_CORTE)
  }

  // El servidor siempre cierra con `event: fin`; si no llegó, la conexión se cortó a mitad.
  if (!completa) throw new ApiError(0, MENSAJE_CORTE)
}

const MENSAJE_CORTE = 'La respuesta se interrumpió antes de terminar. Inténtalo de nuevo.'

/**
 * Lee un evento SSE: nombre (`event:`) y texto (`data:`). Spring no añade espacio tras `data:`,
 * así que NO se recorta: un trozo como " hola" conserva su espacio inicial (el estándar quitaría uno).
 */
function interpretar(evento: string): { nombre: string; datos: string | null } {
  let nombre = 'message'
  const datos: string[] = []
  for (const linea of evento.split(/\r?\n/)) {
    if (linea.startsWith('event:')) nombre = linea.slice(6).trim()
    else if (linea.startsWith('data:')) datos.push(linea.slice(5))
  }
  return { nombre, datos: datos.length > 0 ? datos.join('\n') : null }
}
