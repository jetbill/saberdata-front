import { useContext } from 'react'
import { AuthContext, type AuthContextValor } from './AuthContext'

export function useAuth(): AuthContextValor {
  const contexto = useContext(AuthContext)
  if (!contexto) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>.')
  }
  return contexto
}
