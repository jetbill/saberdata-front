import { Box, Paper, Skeleton, Typography } from '@mui/material'
import { colores } from '../../app/theme'

const formatoNumero = new Intl.NumberFormat('es-CO')

/** Indicador numérico del panel. Componente presentacional: solo dibuja lo que recibe. */
export function TarjetaKpi({
  titulo,
  valor,
  detalle,
  color,
  porcentaje,
  cargando,
}: {
  titulo: string
  valor?: number
  detalle?: string
  /** Color del título y de la barra de proporción. */
  color?: string
  /** 0–100: si se indica, dibuja una barra con esa proporción. */
  porcentaje?: number
  cargando: boolean
}) {
  return (
    <Paper variant="outlined" sx={{ p: 2.75 }}>
      <Typography variant="overline" sx={{ color: color ?? 'text.secondary', lineHeight: 1.5 }}>
        {titulo}
      </Typography>
      {cargando ? (
        <Skeleton variant="text" width={120} sx={{ fontSize: '2.4rem' }} />
      ) : (
        <Typography component="p" sx={{ fontSize: 38, fontWeight: 800, letterSpacing: '-0.02em', mt: 1, lineHeight: 1.2 }}>
          {valor === undefined ? '—' : formatoNumero.format(valor)}
        </Typography>
      )}
      {detalle && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {detalle}
        </Typography>
      )}
      {porcentaje !== undefined && (
        <Box sx={{ height: 6, borderRadius: '3px', bgcolor: '#1b2530', mt: 1.75, overflow: 'hidden' }}>
          <Box sx={{ height: '100%', width: `${porcentaje}%`, bgcolor: color ?? colores.azul }} />
        </Box>
      )}
    </Paper>
  )
}
