import { Paper, Skeleton, Typography } from '@mui/material'

const formatoNumero = new Intl.NumberFormat('es-CO')

/** Indicador numérico del panel. Componente presentacional: solo dibuja lo que recibe. */
export function TarjetaKpi({
  titulo,
  valor,
  detalle,
  color,
  cargando,
}: {
  titulo: string
  valor?: number
  detalle?: string
  color?: string
  cargando: boolean
}) {
  return (
    <Paper variant="outlined" sx={{ p: 2.5, borderLeft: 4, borderLeftColor: color ?? 'divider' }}>
      <Typography variant="overline" color="text.secondary">
        {titulo}
      </Typography>
      {cargando ? (
        <Skeleton variant="text" width={120} sx={{ fontSize: '2rem' }} />
      ) : (
        <Typography variant="h4" component="p">
          {valor === undefined ? '—' : formatoNumero.format(valor)}
        </Typography>
      )}
      {detalle && (
        <Typography variant="body2" color="text.secondary">
          {detalle}
        </Typography>
      )}
    </Paper>
  )
}
