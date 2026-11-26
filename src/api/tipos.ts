/**
 * Contrato con el backend (SaberData). Cada tipo refleja un DTO de com.saberdata.dto.
 * Si el backend cambia un DTO, este es el único archivo del frontend que debe actualizarse.
 */

export type Rol = 'USER' | 'ADMIN'
export type Rendimiento = 'ALTO' | 'BAJO'

// --- Autenticación ---------------------------------------------------------

export interface Usuario {
  id: number
  username: string
  email: string
  rol: Rol
  activo: boolean
  creadoEn: string
}

export interface DatosRegistro {
  username: string
  email: string
  password: string
  /** Token de Cloudflare Turnstile; el backend lo exige si tiene el CAPTCHA activado. */
  captchaToken?: string
}

export interface TokenRespuesta {
  accessToken: string
  tokenType: string
  expiresInSeconds: number
}

// --- Estadísticas ----------------------------------------------------------

export interface Resumen {
  totalEstudiantes: number
  rendimientoAlto: number
  rendimientoBajo: number
  porcentajeAlto: number
  porcentajeBajo: number
}

export interface GrupoRendimiento {
  grupo: string
  total: number
  alto: number
  bajo: number
  porcentajeAlto: number
  porcentajeBajo: number
}

/** Las cinco agrupaciones disponibles: /api/estadisticas/rendimiento-por-{agrupacion}. */
export type Agrupacion =
  | 'estrato'
  | 'jornada'
  | 'naturaleza'
  | 'departamento'
  | 'internet-computador'

// --- Resultados ------------------------------------------------------------

export interface Resultado {
  id: number
  genero: string
  deptoResidencia: string
  estrato: string
  educacionMadre: string
  educacionPadre: string
  tieneInternet: string
  tieneComputador: string
  tieneAutomovil: string
  tieneLavadora: string
  cuartosHogar: string
  personasHogar: string
  naturalezaColegio: string
  areaColegio: string
  jornada: string
  caracterColegio: string
  calendarioColegio: string
  deptoColegio: string
  rendimiento: Rendimiento
}

export interface FiltrosResultados {
  estrato?: string
  jornada?: string
  naturaleza?: string
  departamento?: string
  rendimiento?: Rendimiento
  page?: number
  size?: number
}

export interface Pagina<T> {
  contenido: T[]
  pagina: number
  tamano: number
  totalElementos: number
  totalPaginas: number
}

// --- Chat ------------------------------------------------------------------

export interface Conversacion {
  id: string
  titulo: string
  creadaEn: string
}

export interface Mensaje {
  id: number
  rol: 'USER' | 'ASSISTANT'
  contenido: string
  creadoEn: string
}

export interface RespuestaChat {
  conversacionId: string
  respuesta: string
}

// --- Minería de datos (modelo J48 de Weka) --------------------------------

export interface MetricasClase {
  precision: number
  recall: number
  f1: number
}

export interface MetricasModelo {
  instancias: number
  atributos: number
  pliegues: number
  minObj: number
  exactitud: number
  /** Exactitud de predecir siempre la clase mayoritaria: el mínimo que debe superar el modelo. */
  exactitudBase: number
  kappa: number
  auc: number
  alto: MetricasClase
  bajo: MetricasClase
  /** Filas = clase real, columnas = clase predicha, en el orden ALTO, BAJO. */
  matrizConfusion: number[][]
  hojas: number
  tamanoArbol: number
  segundos: number
}

export interface Modelo {
  disponible: boolean
  entrenadoEn: string | null
  algoritmo: string | null
  metricas: MetricasModelo | null
}

export interface AtributoModelo {
  clave: string
  etiqueta: string
  valores: string[]
}

export interface Prediccion {
  prediccion: Rendimiento
  probabilidadAlto: number
  probabilidadBajo: number
  /** Atributos cuyo valor el modelo no conocía y se trataron como dato faltante. */
  ignorados: string[]
}

export interface ArbolModelo {
  texto: string
  lineas: number
  truncado: boolean
}

// --- Errores ---------------------------------------------------------------

/** Formato uniforme de error que devuelve toda la API. */
export interface ErrorApiCuerpo {
  timestamp: string
  status: number
  error: string
  mensaje: string
  ruta: string
  detalles: string[]
}
