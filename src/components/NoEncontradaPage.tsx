import { Button, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router'

export function NoEncontradaPage() {
  return (
    <Stack spacing={2} sx={{ alignItems: 'center', py: 8, textAlign: 'center' }}>
      <Typography variant="h2" component="p" color="text.secondary">
        404
      </Typography>
      <Typography variant="h5" component="h1">
        Esta página no existe
      </Typography>
      <Button component={RouterLink} to="/" variant="contained">
        Volver al panel
      </Button>
    </Stack>
  )
}
