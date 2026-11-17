import ConstructionIcon from '@mui/icons-material/Construction'
import { Paper, Stack, Typography } from '@mui/material'

/** Marcador de las pantallas que aún no se construyen; se reemplaza pantalla por pantalla. */
export function PaginaPendiente({ titulo, descripcion }: { titulo: string; descripcion: string }) {
  return (
    <Stack spacing={3}>
      <Typography variant="h4" component="h1">
        {titulo}
      </Typography>
      <Paper variant="outlined" sx={{ p: 4, textAlign: 'center' }}>
        <ConstructionIcon color="disabled" sx={{ fontSize: 48 }} />
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          {descripcion}
        </Typography>
      </Paper>
    </Stack>
  )
}
