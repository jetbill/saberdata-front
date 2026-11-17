/**
 * Guarda el JWT. Se mantiene también en memoria por si el navegador bloquea localStorage
 * (modo privado, datos de sitio deshabilitados): la sesión funciona, aunque no sobreviva a recargar.
 *
 * Nota de seguridad: localStorage es legible por cualquier script de la página (XSS). Es una
 * decisión aceptable para un proyecto de aula; en producción se preferiría una cookie HttpOnly.
 */
const CLAVE = 'saberdata.token'

let enMemoria: string | null = null

export function leerToken(): string | null {
  if (enMemoria) return enMemoria
  try {
    enMemoria = localStorage.getItem(CLAVE)
  } catch {
    // localStorage no disponible: solo memoria.
  }
  return enMemoria
}

export function guardarToken(token: string): void {
  enMemoria = token
  try {
    localStorage.setItem(CLAVE, token)
  } catch {
    // Sin persistencia entre recargas.
  }
}

export function borrarToken(): void {
  enMemoria = null
  try {
    localStorage.removeItem(CLAVE)
  } catch {
    // Nada que borrar.
  }
}
