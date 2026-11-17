import { peticion } from '../../api/client'
import type { Usuario } from '../../api/tipos'

/** Acceso HTTP a /api/admin (el backend exige rol ADMIN en cada petición). */
export const adminApi = {
  usuarios: (signal?: AbortSignal) => peticion<Usuario[]>('/api/admin/usuarios', { signal }),
}
