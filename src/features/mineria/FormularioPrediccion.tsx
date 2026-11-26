import { Box, Button, MenuItem, Paper, Stack, TextField, Typography } from '@mui/material'
import type { AtributoModelo } from '../../api/tipos'

/** Presentacional: un selector por atributo del modelo. Todos son opcionales; «Sin dato» deja el atributo vacío. */
export function FormularioPrediccion({
  atributos,
  valores,
  enviando,
  onCambio,
  onPredecir,
  onLimpiar,
}: {
  atributos: AtributoModelo[]
  valores: Record<string, string>
  enviando: boolean
  onCambio: (clave: string, valor: string) => void
  onPredecir: () => void
  onLimpiar: () => void
}) {
  const completados = atributos.filter((a) => valores[a.clave]).length

  return (
    <Paper variant="outlined" sx={{ p: 2.5 }}>
      <Stack spacing={2}>
        <Box>
          <Typography variant="h6" component="h2">
            Datos del estudiante
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Completa los que conozcas: el modelo acepta datos faltantes, pero predice mejor con más información.
          </Typography>
        </Box>

        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', xl: 'repeat(3, 1fr)' } }}>
          {atributos.map((a) => (
            <TextField
              key={a.clave}
              select
              size="small"
              label={a.etiqueta}
              value={valores[a.clave] ?? ''}
              onChange={(e) => onCambio(a.clave, e.target.value)}
            >
              <MenuItem value="">Sin dato</MenuItem>
              {a.valores.map((v) => (
                <MenuItem key={v} value={v}>
                  {v}
                </MenuItem>
              ))}
            </TextField>
          ))}
        </Box>

        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Button variant="contained" onClick={onPredecir} disabled={enviando || completados === 0}>
            {enviando ? 'Calculando…' : 'Predecir'}
          </Button>
          <Button onClick={onLimpiar} disabled={enviando || completados === 0}>
            Limpiar
          </Button>
          <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
            {completados} de {atributos.length} datos
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  )
}
