import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'
import { BrowserRouter } from 'react-router'
import { ApiError } from '../api/client'
import { AuthProvider } from '../features/auth/AuthProvider'
import { theme } from './theme'

function crearQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000, // las estadísticas no cambian cada segundo
        refetchOnWindowFocus: false,
        // No reintentar errores del servidor que no se arreglan solos (400-499); sí los de red o 5xx.
        retry: (intentos, error) =>
          !(error instanceof ApiError && error.status >= 400 && error.status < 500) && intentos < 2,
      },
    },
  })
}

/**
 * Árbol de proveedores, de afuera hacia adentro:
 * tema → caché de datos del servidor → rutas → sesión.
 * AuthProvider va dentro de QueryClientProvider (limpia la caché al cerrar sesión).
 */
export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(crearQueryClient)
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>{children}</AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
