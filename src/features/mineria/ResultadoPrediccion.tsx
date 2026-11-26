import { Alert, Box, Paper, Stack, Typography } from '@mui/material'
import type { AtributoModelo, Prediccion } from '../../api/tipos'
import { colores } from '../../app/theme'
import { porcentaje } from './formato'

function Barra({ etiqueta, valor, color }: { etiqueta: string; valor: number; color: string }) {
  return (
    <Box>
      <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
        <Typography variant="body2">{etiqueta}</Typography>
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          {porcentaje(valor)}
        </Typography>
      </Stack>
      <Box sx={{ height: 8, borderRadius: '4px', bgcolor: '#1b2530', mt: 0.5, overflow: 'hidden' }}>
        <Box sx={{ height: '100%', width: `${valor * 100}%`, bgcolor: color }} />
      </Box>
    </Box>
  )
}

/** Presentacional: la clase predicha y las probabilidades de cada clase. */
export function ResultadoPrediccion({
  resultado,
  atributos,
}: {
  resultado: Prediccion
  atributos: AtributoModelo[]
}) {
  const alto = resultado.prediccion === 'ALTO'
  const ignorados = resultado.ignorados.map((k) => atributos.find((a) => a.clave === k)?.etiqueta ?? k)

  return (
    <Paper variant="outlined" sx={{ p: 2.5 }} aria-live="polite">
      <Stack spacing={2}>
        <Typography variant="overline" color="text.secondary">
          Rendimiento previsto
        </Typography>
        <Typography
          component="p"
          sx={{ fontSize: 44, fontWeight: 800, lineHeight: 1, color: alto ? colores.alto : colores.bajo }}
        >
          {alto ? 'ALTO' : 'BAJO'}
        </Typography>
        <Barra etiqueta="Probabilidad de rendimiento alto" valor={resultado.probabilidadAlto} color={colores.alto} />
        <Barra etiqueta="Probabilidad de rendimiento bajo" valor={resultado.probabilidadBajo} color={colores.bajo} />
        {ignorados.length > 0 && (
          <Alert severity="info">
            Valores que el modelo no conoce y se trataron como dato faltante: {ignorados.join(', ')}.
          </Alert>
        )}
        <Typography variant="caption" color="text.secondary">
          Es una estimación estadística a partir de los resultados Saber 11 2022-4, no un diagnóstico individual.
        </Typography>
      </Stack>
    </Paper>
  )
}
