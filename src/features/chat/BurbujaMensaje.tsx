import { Box, Paper, Typography } from '@mui/material'
import { colores } from '../../app/theme'

/** Presentacional: una burbuja de chat. El usuario a la derecha, el asistente a la izquierda. */
export function BurbujaMensaje({
  rol,
  contenido,
  escribiendo,
}: {
  rol: 'USER' | 'ASSISTANT'
  contenido: string
  escribiendo?: boolean
}) {
  const esUsuario = rol === 'USER'
  return (
    <Box sx={{ display: 'flex', justifyContent: esUsuario ? 'flex-end' : 'flex-start' }}>
      <Paper
        elevation={0}
        sx={{
          px: 2,
          py: 1.25,
          maxWidth: { xs: '92%', sm: '75%' },
          bgcolor: esUsuario ? 'primary.main' : colores.lateral,
          border: esUsuario ? 0 : `1px solid ${colores.linea}`,
          color: esUsuario ? 'primary.contrastText' : 'text.primary',
          whiteSpace: 'pre-wrap',
          overflowWrap: 'anywhere',
        }}
      >
        <Typography variant="body1" component="p">
          {contenido || (escribiendo ? 'Pensando…' : '')}
          {escribiendo && contenido && <span aria-hidden> ▍</span>}
        </Typography>
      </Paper>
    </Box>
  )
}
