import { Alert, Box, Paper, Skeleton, Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { PieChart } from '@mui/x-charts/PieChart'
import { useMemo, useState } from 'react'
import { describirError } from '../../api/client'
import type { Agrupacion } from '../../api/tipos'
import { GraficoAgrupacion } from './GraficoAgrupacion'
import { TarjetaKpi } from './TarjetaKpi'
import { useRendimientoPor, useResumen } from './useEstadisticas'

const AGRUPACIONES: { valor: Agrupacion; etiqueta: string }[] = [
  { valor: 'estrato', etiqueta: 'Estrato' },
  { valor: 'jornada', etiqueta: 'Jornada' },
  { valor: 'naturaleza', etiqueta: 'Naturaleza' },
  { valor: 'internet-computador', etiqueta: 'Internet y computador' },
  { valor: 'departamento', etiqueta: 'Departamento' },
]

const pct = (n: number) => `${n.toLocaleString('es-CO', { maximumFractionDigits: 2 })} %`

/** Contenedor: pide los datos con los hooks y se los pasa a componentes que solo dibujan. */
export function DashboardPage() {
  const theme = useTheme()
  const [agrupacion, setAgrupacion] = useState<Agrupacion>('estrato')

  const resumen = useResumen()
  const grupos = useRendimientoPor(agrupacion)

  // Departamentos: ordenados de mayor a menor % de rendimiento bajo, para ver dónde está la brecha.
  const gruposOrdenados = useMemo(() => {
    if (!grupos.data) return undefined
    const copia = [...grupos.data]
    return agrupacion === 'departamento'
      ? copia.sort((a, b) => b.porcentajeBajo - a.porcentajeBajo)
      : copia.sort((a, b) => a.grupo.localeCompare(b.grupo, 'es'))
  }, [grupos.data, agrupacion])

  const r = resumen.data
  const errorResumen = resumen.error ? describirError(resumen.error).mensaje : undefined
  const errorGrupos = grupos.error ? describirError(grupos.error).mensaje : undefined

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" component="h1">
          Panel de estadísticas
        </Typography>
        <Typography color="text.secondary">
          Resultados Saber 11 (ICFES 2022-4): variable objetivo, rendimiento ALTO o BAJO.
        </Typography>
      </Box>

      {errorResumen && <Alert severity="error">{errorResumen}</Alert>}

      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' } }}>
        <TarjetaKpi titulo="Estudiantes" valor={r?.totalEstudiantes} cargando={resumen.isPending} />
        <TarjetaKpi
          titulo="Rendimiento alto"
          valor={r?.rendimientoAlto}
          detalle={r ? pct(r.porcentajeAlto) : undefined}
          color={theme.palette.success.main}
          cargando={resumen.isPending}
        />
        <TarjetaKpi
          titulo="Rendimiento bajo"
          valor={r?.rendimientoBajo}
          detalle={r ? pct(r.porcentajeBajo) : undefined}
          color={theme.palette.error.main}
          cargando={resumen.isPending}
        />
      </Box>

      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', lg: '1fr 2fr' }, alignItems: 'start' }}>
        <Paper variant="outlined" sx={{ p: 2.5 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            Distribución general
          </Typography>
          {r ? (
            <PieChart
              height={280}
              series={[
                {
                  innerRadius: 60,
                  paddingAngle: 2,
                  cornerRadius: 4,
                  data: [
                    { id: 'alto', label: 'Alto', value: r.rendimientoAlto, color: theme.palette.success.main },
                    { id: 'bajo', label: 'Bajo', value: r.rendimientoBajo, color: theme.palette.error.main },
                  ],
                },
              ]}
            />
          ) : (
            <Skeleton variant="rounded" height={280} />
          )}
        </Paper>

        <Paper variant="outlined" sx={{ p: 2.5 }}>
          <Stack spacing={2}>
            <Typography variant="h6" component="h2">
              Rendimiento por {AGRUPACIONES.find((a) => a.valor === agrupacion)?.etiqueta.toLowerCase()}
            </Typography>
            <ToggleButtonGroup
              exclusive
              size="small"
              color="primary"
              value={agrupacion}
              onChange={(_, valor: Agrupacion | null) => valor && setAgrupacion(valor)}
              aria-label="Agrupar rendimiento por"
              sx={{ flexWrap: 'wrap' }}
            >
              {AGRUPACIONES.map((a) => (
                <ToggleButton key={a.valor} value={a.valor}>
                  {a.etiqueta}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
            <GraficoAgrupacion
              grupos={gruposOrdenados}
              cargando={grupos.isPending}
              error={errorGrupos}
              horizontal={agrupacion === 'departamento'}
            />
          </Stack>
        </Paper>
      </Box>
    </Stack>
  )
}
