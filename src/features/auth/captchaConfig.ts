/**
 * Clave PÚBLICA del sitio de Cloudflare Turnstile. Sin ella el CAPTCHA queda desactivado en el
 * frontend (el backend decide con CAPTCHA_ENABLED si lo exige). La clave secreta vive solo en el backend.
 */
export const TURNSTILE_SITE_KEY: string = import.meta.env.VITE_TURNSTILE_SITE_KEY ?? ''

export const CAPTCHA_ACTIVO = TURNSTILE_SITE_KEY !== ''
