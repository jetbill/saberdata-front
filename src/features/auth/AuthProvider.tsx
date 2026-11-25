import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { registrarManejadorNoAutorizado } from '../../api/client'
import type { DatosRegistro } from '../../api/tipos'
import { authApi } from './authApi'
import { AuthContext, type AuthContextValor } from './AuthContext'
import { decodificarJwt, haExpirado } from './jwt'
import { borrarToken, guardarToken, leerToken } from './tokenStorage'

/** Token guardado, o null si no hay, está dañado o ya venció (en ese caso se limpia). */
function tokenInicial(): string | null {
  const token = leerToken()
  if (!token) return null
  const claims = decodificarJwt(token)
  if (!claims || haExpirado(claims)) {
    borrarToken()
    return null
  }
  return token
}

// setTimeout no admite retardos mayores a 2^31 - 1 ms.
const MAX_TIMEOUT_MS = 2_147_483_647

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [token, setToken] = useState<string | null>(tokenInicial)

  const claims = useMemo(() => (token ? decodificarJwt(token) : null), [token])

  const logout = useCallback(() => {
    borrarToken()
    setToken(null)
    // Que los datos en caché de este usuario no se vean al entrar con otra cuenta.
    queryClient.clear()
  }, [queryClient])

  // Si el backend responde 401 con un token enviado (vencido o revocado), se cierra la sesión.
  useEffect(() => {
    registrarManejadorNoAutorizado(logout)
    return () => registrarManejadorNoAutorizado(null)
  }, [logout])

  // Cierra la sesión sola cuando el token vence.
  useEffect(() => {
    if (!claims) return
    const restante = claims.exp * 1000 - Date.now()
    const id = window.setTimeout(logout, Math.min(Math.max(restante, 0), MAX_TIMEOUT_MS))
    return () => window.clearTimeout(id)
  }, [claims, logout])

  const login = useCallback(async (username: string, password: string, captchaToken?: string) => {
    const respuesta = await authApi.login(username, password, captchaToken)
    guardarToken(respuesta.accessToken)
    setToken(respuesta.accessToken)
  }, [])

  const registrar = useCallback(async (datos: DatosRegistro) => {
    await authApi.registrar(datos)
  }, [])

  const valor = useMemo<AuthContextValor>(
    () => ({
      usuario: claims ? { username: claims.sub, rol: claims.rol } : null,
      estaAutenticado: claims !== null,
      esAdmin: claims?.rol === 'ADMIN',
      login,
      registrar,
      logout,
    }),
    [claims, login, registrar, logout],
  )

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>
}
