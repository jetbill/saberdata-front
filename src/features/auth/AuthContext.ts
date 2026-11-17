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
  login: (username: string, password: string) => Promise<void>
  /** Crea la cuenta e inicia sesión con ella. */
  registrar: (datos: DatosRegistro) => Promise<void>
  logout: () => void
}

export const AuthContext = createContext<AuthContextValor | null>(null)
