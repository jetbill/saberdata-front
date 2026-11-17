import { peticion } from '../../api/client'
import type { DatosRegistro, TokenRespuesta, Usuario } from '../../api/tipos'

/** Capa de acceso a datos de autenticación: solo habla HTTP, no conoce React. */
export const authApi = {
  login: (username: string, password: string) =>
    peticion<TokenRespuesta>('/api/auth/login', {
      method: 'POST',
      body: { username, password },
      conAuth: false,
    }),

  registrar: (datos: DatosRegistro) =>
    peticion<Usuario>('/api/auth/register', { method: 'POST', body: datos, conAuth: false }),

  yo: () => peticion<Usuario>('/api/auth/me'),
}
