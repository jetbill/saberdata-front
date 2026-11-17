import { Alert, Box, Button, CircularProgress, Link, Stack, TextField, Typography } from '@mui/material'
import { useState, type SubmitEventHandler } from 'react'
import { Link as RouterLink } from 'react-router'
import { describirError } from '../../api/client'
import { PaginaAuth } from './PaginaAuth'
import { useAuth } from './useAuth'

export function LoginPage() {
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  const enviar: SubmitEventHandler<HTMLFormElement> = async (evento) => {
    evento.preventDefault()
    setError(null)
    setEnviando(true)
    try {
      // Al quedar autenticado, <SoloInvitados> redirige a la página que el usuario quería ver.
      await login(username.trim(), password)
    } catch (e) {
      setError(describirError(e).mensaje)
      setEnviando(false)
    }
  }

  return (
    <PaginaAuth titulo="Iniciar sesión" subtitulo="Accede para explorar los resultados Saber 11">
      <Box component="form" onSubmit={enviar} noValidate>
        <Stack spacing={2}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            autoFocus
            required
          />
          <TextField
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={enviando || !username.trim() || !password}
            startIcon={enviando ? <CircularProgress size={18} color="inherit" /> : undefined}
          >
            {enviando ? 'Entrando…' : 'Entrar'}
          </Button>
          <Typography variant="body2" align="center">
            ¿No tienes cuenta?{' '}
            <Link component={RouterLink} to="/registro">
              Regístrate
            </Link>
          </Typography>
        </Stack>
      </Box>
    </PaginaAuth>
  )
}
