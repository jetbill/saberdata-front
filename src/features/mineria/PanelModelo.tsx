import { Box, Button, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material'
import type { Modelo } from '../../api/tipos'
import { decimal, porcentaje } from './formato'

function Dato({ titulo, valor, detalle }: { titulo: string; valor: string; detalle?: string }) {
  return (
    <Box>
      <Typography variant="overline" color="text.secondary">
        {titulo}
      </Typography>
      <Typography component="p" sx={{ fontSize: 28, fontWeight: 800, lineHeight: 1.2 }}>
        {valor}
      </Typography>
      {detalle && (
        <Typography variant="caption" color="text.secondary">
          {detalle}
        </Typography>
      )}
    </Box>
  )
}

/** Presentacional: métricas de la validación cruzada del modelo y acceso al árbol. */
export function PanelModelo({ modelo, onVerArbol }: { modelo: Modelo; onVerArbol: () => void }) {
  const m = modelo.metricas
  if (!m) return null
  const [[altoAlto, altoBajo], [bajoAlto, bajoBajo]] = m.matrizConfusion
  const clases = [
    { clase: 'ALTO', datos: m.alto },
    { clase: 'BAJO', datos: m.bajo },
  ]

  return (
    <Paper variant="outlined" sx={{ p: 2.5 }}>
      <Stack spacing={2.5}>
        <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
          <Box>
            <Typography variant="h6" component="h2">
              Calidad del modelo
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {modelo.algoritmo}. Evaluado con validación cruzada de {m.pliegues} pliegues sobre{' '}
              {m.instancias.toLocaleString('es-CO')} estudiantes
              {modelo.entrenadoEn && ` · entrenado el ${new Date(modelo.entrenadoEn).toLocaleString('es-CO')}`}.
            </Typography>
          </Box>
          <Button variant="outlined" onClick={onVerArbol}>
            Ver árbol
          </Button>
        </Stack>

        <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' } }}>
          <Dato titulo="Exactitud" valor={porcentaje(m.exactitud)} detalle="aciertos en la validación cruzada" />
          <Dato titulo="Línea base" valor={porcentaje(m.exactitudBase)} detalle="predecir siempre la clase mayoritaria" />
          <Dato titulo="AUC" valor={decimal(m.auc)} detalle="0,5 = azar, 1 = perfecto" />
          <Dato titulo="Kappa" valor={decimal(m.kappa)} detalle="acuerdo más allá del azar" />
        </Box>

        <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' } }}>
          <Box sx={{ overflowX: 'auto' }}>
            <Typography variant="subtitle2" gutterBottom>
              Matriz de confusión
            </Typography>
            <Table size="small" aria-label="Matriz de confusión">
              <TableHead>
                <TableRow>
                  <TableCell>Real / Predicho</TableCell>
                  <TableCell align="right">ALTO</TableCell>
                  <TableCell align="right">BAJO</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>ALTO</TableCell>
                  <TableCell align="right">{altoAlto.toLocaleString('es-CO')}</TableCell>
                  <TableCell align="right">{altoBajo.toLocaleString('es-CO')}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>BAJO</TableCell>
                  <TableCell align="right">{bajoAlto.toLocaleString('es-CO')}</TableCell>
                  <TableCell align="right">{bajoBajo.toLocaleString('es-CO')}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>

          <Box sx={{ overflowX: 'auto' }}>
            <Typography variant="subtitle2" gutterBottom>
              Por clase
            </Typography>
            <Table size="small" aria-label="Métricas por clase">
              <TableHead>
                <TableRow>
                  <TableCell>Clase</TableCell>
                  <TableCell align="right">Precisión</TableCell>
                  <TableCell align="right">Sensibilidad</TableCell>
                  <TableCell align="right">F1</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {clases.map(({ clase, datos }) => (
                  <TableRow key={clase}>
                    <TableCell>{clase}</TableCell>
                    <TableCell align="right">{porcentaje(datos.precision)}</TableCell>
                    <TableCell align="right">{porcentaje(datos.recall)}</TableCell>
                    <TableCell align="right">{porcentaje(datos.f1)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Box>

        <Typography variant="caption" color="text.secondary">
          Árbol final: {m.hojas.toLocaleString('es-CO')} hojas y {m.tamanoArbol.toLocaleString('es-CO')} nodos, con un mínimo de{' '}
          {m.minObj} estudiantes por hoja. Entrenamiento y evaluación: {m.segundos} s.
        </Typography>
      </Stack>
    </Paper>
  )
}
