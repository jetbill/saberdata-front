import SchoolIcon from '@mui/icons-material/School'
import { Box, Paper, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import { colores } from '../../app/theme'

/** Marco común de las pantallas públicas (login y registro): tarjeta centrada con la marca. */
export function PaginaAuth({
  titulo,
  subtitulo,
  children,
}: {
  titulo: string
  subtitulo: string
  children: ReactNode
}) {
  return (
    <Box
      sx={{
        minHeight: '100dvh',
        display: 'grid',
        placeItems: 'center',
        p: 2,
        background: `radial-gradient(60% 45% at 50% 0%, rgba(56, 189, 248, 0.12), transparent), ${colores.fondo}`,
      }}
    >
      <Paper variant="outlined" sx={{ width: '100%', maxWidth: 420, p: { xs: 3, sm: 4 } }}>
        <Stack spacing={3}>
          <Stack spacing={1} sx={{ alignItems: 'center', textAlign: 'center' }}>
            <Stack direction="row" spacing={1.25} sx={{ alignItems: 'center', pb: 1 }}>
              <SchoolIcon sx={{ fontSize: 30, color: colores.azul }} />
              <Typography component="span" sx={{ fontWeight: 800, fontSize: 22 }}>
                SaberData
              </Typography>
            </Stack>
            <Typography variant="h5" component="h1">
              {titulo}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {subtitulo}
            </Typography>
          </Stack>
          {children}
        </Stack>
      </Paper>
    </Box>
  )
}
