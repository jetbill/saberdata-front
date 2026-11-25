import type { TurnstileInstance } from '@marsidev/react-turnstile'
import { Alert, Box, Button, CircularProgress, Link, Stack, TextField, Typography } from '@mui/material'
import { useRef, useState, type SubmitEventHandler } from 'react'
import { Link as RouterLink, useLocation } from 'react-router'
import { describirError } from '../../api/client'
import { CampoCaptcha } from './CampoCaptcha'
import { CAPTCHA_ACTIVO } from './captchaConfig'
import { PaginaAuth } from './PaginaAuth'
import { useAuth } from './useAuth'

export function LoginPage() {
  const { login } = useAuth()
  // Tras registrarse, RegisterPage envía aquí al usuario con este aviso.
  const registrado = (useLocation().state as { registrado?: string } | null)?.registrado
  const [username, setUsername] = useState(registrado ?? '')
  const [password, setPassword] = useState('')
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const captcha = useRef<TurnstileInstance>(null)
  const [error, setError] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  const enviar: SubmitEventHandler<HTMLFormElement> = async (evento) => {
    evento.preventDefault()
    setError(null)
    setEnviando(true)
    try {
      // Al quedar autenticado, <SoloInvitados> redirige a la página que el usuario quería ver.
      await login(username.trim(), password, captchaToken ?? undefined)
    } catch (e) {
      setError(describirError(e).mensaje)
      setEnviando(false)
      // El token de Turnstile es de un solo uso: hay que pedir uno nuevo para reintentar.
      captcha.current?.reset()
      setCaptchaToken(null)
    }
  }

  return (
    <PaginaAuth titulo="Iniciar sesión" subtitulo="Accede para explorar los resultados Saber 11">
      <Box component="form" onSubmit={enviar} noValidate>
        <Stack spacing={2}>
          {registrado && !error && (
            <Alert severity="success">Cuenta creada. Inicia sesión con tu contraseña.</Alert>
          )}
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            autoFocus={!registrado}
            required
          />
          <TextField
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            autoFocus={Boolean(registrado)}
            required
          />
          <CampoCaptcha onToken={setCaptchaToken} instancia={captcha} />
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={enviando || !username.trim() || !password || (CAPTCHA_ACTIVO && !captchaToken)}
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
