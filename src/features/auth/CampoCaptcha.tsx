import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile'
import { Box } from '@mui/material'
import type { Ref } from 'react'
import { CAPTCHA_ACTIVO, TURNSTILE_SITE_KEY } from './captchaConfig'

/**
 * Widget de Cloudflare Turnstile. Entrega el token con `onToken` (null si caduca o falla).
 * El token es de un solo uso: tras un envío fallido hay que llamar a `instancia.current?.reset()`.
 */
export function CampoCaptcha({
  onToken,
  instancia,
}: {
  onToken: (token: string | null) => void
  instancia: Ref<TurnstileInstance>
}) {
  if (!CAPTCHA_ACTIVO) return null
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', minHeight: 65 }}>
      <Turnstile
        ref={instancia}
        siteKey={TURNSTILE_SITE_KEY}
        onSuccess={onToken}
        onExpire={() => onToken(null)}
        onError={() => onToken(null)}
        options={{ theme: 'dark', language: 'es' }}
      />
    </Box>
  )
}
