import type { TurnstileInstance } from '@marsidev/react-turnstile'
import { Alert, Box, Button, CircularProgress, Link, Stack, TextField, Typography } from '@mui/material'
import { useRef, useState, type SubmitEventHandler } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router'
import { describirError } from '../../api/client'
import { CampoCaptcha } from './CampoCaptcha'
import { CAPTCHA_ACTIVO } from './captchaConfig'
import { PaginaAuth } from './PaginaAuth'
import { useAuth } from './useAuth'

/** Mismas reglas que valida el backend (RegisterRequest), para avisar antes de enviar. */
function validar(username: string, email: string, password: string, repetida: string) {
  const errores: Partial<Record<'username' | 'email' | 'password' | 'repetida', string>> = {}
  if (username.length < 3 || username.length > 50) {
    errores.username = 'Entre 3 y 50 caracteres.'
  } else if (!/^[A-Za-z0-9._-]+$/.test(username)) {
    errores.username = 'Solo letras, números, punto, guion y guion bajo.'
  }
  if (!/^\S+@\S+\.\S+$/.test(email) || email.length > 150) {
    errores.email = 'Escribe un correo válido.'
  }
  if (password.length < 8 || password.length > 72) {
    errores.password = 'Entre 8 y 72 caracteres.'
  }
  if (repetida !== password) {
    errores.repetida = 'Las contraseñas no coinciden.'
  }
  return errores
}

export function RegisterPage() {
  const { registrar } = useAuth()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repetida, setRepetida] = useState('')
  const [intentado, setIntentado] = useState(false)
  const [error, setError] = useState<{ mensaje: string; detalles: string[] } | null>(null)
  const [enviando, setEnviando] = useState(false)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const captcha = useRef<TurnstileInstance>(null)
  const navigate = useNavigate()

  const errores = validar(username.trim(), email.trim(), password, repetida)
  const mostrar = (campo: keyof typeof errores) => (intentado ? errores[campo] : undefined)

  const enviar: SubmitEventHandler<HTMLFormElement> = async (evento) => {
    evento.preventDefault()
    setIntentado(true)
    setError(null)
    if (Object.keys(errores).length > 0) return

    setEnviando(true)
    try {
      await registrar({
        username: username.trim(),
        email: email.trim(),
        password,
        captchaToken: captchaToken ?? undefined,
      })
      // El token del CAPTCHA ya se gastó: se entra por el login, que pide uno nuevo.
      navigate('/login', { state: { registrado: username.trim() }, replace: true })
    } catch (e) {
      setError(describirError(e))
      setEnviando(false)
      // El token de Turnstile es de un solo uso: hay que pedir uno nuevo para reintentar.
      captcha.current?.reset()
      setCaptchaToken(null)
    }
  }

  return (
    <PaginaAuth titulo="Crear cuenta" subtitulo="Regístrate para usar el panel y el asistente">
      <Box component="form" onSubmit={enviar} noValidate>
        <Stack spacing={2}>
          {error && (
            <Alert severity="error">
              {error.mensaje}
              {error.detalles.length > 0 && (
                <ul style={{ margin: '4px 0 0', paddingLeft: 18 }}>
                  {error.detalles.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              )}
            </Alert>
          )}
          <TextField
            label="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={Boolean(mostrar('username'))}
            helperText={mostrar('username')}
            autoComplete="username"
            autoFocus
            required
          />
          <TextField
            label="Correo electrónico"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={Boolean(mostrar('email'))}
            helperText={mostrar('email')}
            autoComplete="email"
            required
          />
          <TextField
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={Boolean(mostrar('password'))}
            helperText={mostrar('password') ?? 'Mínimo 8 caracteres.'}
            autoComplete="new-password"
            required
          />
          <TextField
            label="Repite la contraseña"
            type="password"
            value={repetida}
            onChange={(e) => setRepetida(e.target.value)}
            error={Boolean(mostrar('repetida'))}
            helperText={mostrar('repetida')}
            autoComplete="new-password"
            required
          />
          <CampoCaptcha onToken={setCaptchaToken} instancia={captcha} />
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={enviando || (CAPTCHA_ACTIVO && !captchaToken)}
            startIcon={enviando ? <CircularProgress size={18} color="inherit" /> : undefined}
          >
            {enviando ? 'Creando cuenta…' : 'Registrarme'}
          </Button>
          <Typography variant="body2" align="center">
            ¿Ya tienes cuenta?{' '}
            <Link component={RouterLink} to="/login">
              Inicia sesión
            </Link>
          </Typography>
        </Stack>
      </Box>
    </PaginaAuth>
  )
}
