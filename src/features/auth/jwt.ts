import type { Rol } from '../../api/tipos'

/** Datos del JWT que emite el backend (sub = usuario, rol, exp en segundos desde 1970). */
export interface ClaimsJwt {
  sub: string
  rol: Rol
  exp: number
}

/**
 * Lee el payload SIN verificar la firma: solo sirve para mostrar el usuario y decidir qué menús
 * enseñar. La seguridad real la impone el backend en cada petición.
 */
export function decodificarJwt(token: string): ClaimsJwt | null {
  try {
    const payload = token.split('.')[1]
    if (!payload) return null
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    const datos = JSON.parse(json) as { sub?: unknown; rol?: unknown; exp?: unknown }
    if (typeof datos.sub !== 'string' || typeof datos.exp !== 'number') return null
    return { sub: datos.sub, rol: datos.rol === 'ADMIN' ? 'ADMIN' : 'USER', exp: datos.exp }
  } catch {
    return null
  }
}

export function haExpirado(claims: ClaimsJwt): boolean {
  return claims.exp * 1000 <= Date.now()
}
