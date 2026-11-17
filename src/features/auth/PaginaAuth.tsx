import SchoolIcon from '@mui/icons-material/School'
import { Box, Paper, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'

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
    <Box sx={{ minHeight: '100dvh', display: 'grid', placeItems: 'center', p: 2 }}>
      <Paper variant="outlined" sx={{ width: '100%', maxWidth: 420, p: { xs: 3, sm: 4 } }}>
        <Stack spacing={3}>
          <Stack spacing={1} sx={{ alignItems: 'center', textAlign: 'center' }}>
            <SchoolIcon color="primary" sx={{ fontSize: 44 }} />
            <Typography variant="overline" color="text.secondary" sx={{ lineHeight: 1 }}>
              SaberData Colombia
            </Typography>
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
