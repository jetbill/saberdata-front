import { Alert, Box, Skeleton } from '@mui/material'
import { BarChart } from '@mui/x-charts/BarChart'
import type { GrupoRendimiento } from '../../api/tipos'
import { colores } from '../../app/theme'

/**
 * Barras apiladas al 100 %: cuánto de cada grupo tiene rendimiento ALTO y BAJO.
 * Con muchos grupos (departamentos) se dibuja horizontal para que las etiquetas quepan.
 */
export function GraficoAgrupacion({
  grupos,
  cargando,
  error,
  horizontal,
}: {
  grupos?: GrupoRendimiento[]
  cargando: boolean
  error?: string
  horizontal: boolean
}) {
  if (error) return <Alert severity="error">{error}</Alert>
  if (cargando || !grupos) return <Skeleton variant="rounded" height={360} />
  if (grupos.length === 0) return <Alert severity="info">No hay datos para esta agrupación.</Alert>

  // El dataset de MUI X exige firma de índice; una copia plana la cumple sin tocar el DTO.
  const dataset = grupos.map((g) => ({ ...g }))
  const colorAlto = colores.alto
  const colorBajo = colores.bajo
  const alturaHorizontal = Math.max(360, grupos.length * 26 + 80)

  const series = [
    { dataKey: 'porcentajeAlto', label: 'Rendimiento alto (%)', stack: 'total', color: colorAlto },
    { dataKey: 'porcentajeBajo', label: 'Rendimiento bajo (%)', stack: 'total', color: colorBajo },
  ]

  return (
    <Box sx={{ width: '100%' }}>
      {horizontal ? (
        <BarChart
          layout="horizontal"
          dataset={dataset}
          yAxis={[{ scaleType: 'band', dataKey: 'grupo', width: 150 }]}
          xAxis={[{ min: 0, max: 100, valueFormatter: (v: number) => `${v}%` }]}
          series={series.map((s) => ({ ...s, layout: 'horizontal' as const }))}
          height={alturaHorizontal}
        />
      ) : (
        <BarChart
          dataset={dataset}
          xAxis={[{ scaleType: 'band', dataKey: 'grupo' }]}
          yAxis={[{ min: 0, max: 100, valueFormatter: (v: number) => `${v}%` }]}
          series={series}
          height={360}
        />
      )}
    </Box>
  )
}
