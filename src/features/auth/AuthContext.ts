import { createContext } from 'react'
import type { DatosRegistro, Rol } from '../../api/tipos'

export interface UsuarioSesion {
  username: string
  rol: Rol
}

export interface AuthContextValor {
  usuario: UsuarioSesion | null
  estaAutenticado: boolean
  esAdmin: boolean
  login: (username: string, password: string, captchaToken?: string) => Promise<void>
  /**
   * Crea la cuenta, sin iniciar sesión: el token del CAPTCHA es de un solo uso y ya se gastó
   * en el registro, así que el usuario entra después por la pantalla de login.
   */
  registrar: (datos: DatosRegistro) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValor | null>(null)
