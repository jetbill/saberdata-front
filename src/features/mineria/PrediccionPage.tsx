import { Alert, Box, Button, CircularProgress, Paper, Skeleton, Stack, Typography } from '@mui/material'
import { useState } from 'react'
import { describirError } from '../../api/client'
import { useAuth } from '../auth/useAuth'
import { DialogoArbol } from './DialogoArbol'
import { FormularioPrediccion } from './FormularioPrediccion'
import { PanelModelo } from './PanelModelo'
import { ResultadoPrediccion } from './ResultadoPrediccion'
import { useAtributos, useEntrenar, useModelo, usePredecir } from './useMineria'

/**
 * Contenedor de la minería de datos: pide el estado del modelo J48 y, si existe, muestra el formulario de
 * predicción y las métricas. Solo el administrador ve el botón para entrenar o reentrenar.
 */
export function PrediccionPage() {
  const { esAdmin } = useAuth()
  const modelo = useModelo()
  const disponible = modelo.data?.disponible ?? false
  const atributos = useAtributos(disponible)
  const predecir = usePredecir()
  const entrenar = useEntrenar()

  const [valores, setValores] = useState<Record<string, string>>({})
  const [arbolAbierto, setArbolAbierto] = useState(false)

  const cambiar = (clave: string, valor: string) => setValores((v) => ({ ...v, [clave]: valor }))

  // Solo se envían los atributos con valor: un atributo ausente es un dato faltante para el modelo.
  const enviar = () => {
    const llenos = Object.fromEntries(Object.entries(valores).filter(([, v]) => v !== ''))
    predecir.mutate(llenos)
  }

  const limpiar = () => {
    setValores({})
    predecir.reset()
  }

  const errorModelo = modelo.error ? describirError(modelo.error).mensaje : undefined
  const errorAtributos = atributos.error ? describirError(atributos.error).mensaje : undefined
  const errorPrediccion = predecir.error ? describirError(predecir.error).mensaje : undefined
  const errorEntrenar = entrenar.error ? describirError(entrenar.error).mensaje : undefined

  const botonEntrenar = esAdmin && (
    <Button
      variant={disponible ? 'outlined' : 'contained'}
      onClick={() => entrenar.mutate()}
      disabled={entrenar.isPending}
      startIcon={entrenar.isPending ? <CircularProgress size={18} color="inherit" /> : undefined}
    >
      {entrenar.isPending ? 'Entrenando…' : disponible ? 'Reentrenar modelo' : 'Entrenar modelo'}
    </Button>
  )

  return (
    <Stack spacing={3}>
      <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
        <Box>
          <Typography variant="h4" component="h1">
            Predicción
          </Typography>
          <Typography color="text.secondary">
            Un árbol de decisión (Weka J48) entrenado con los resultados Saber 11 estima si el rendimiento será alto o bajo.
          </Typography>
        </Box>
        {disponible && botonEntrenar}
      </Stack>

      {errorModelo && <Alert severity="error">{errorModelo}</Alert>}
      {errorEntrenar && <Alert severity="error">{errorEntrenar}</Alert>}
      {entrenar.isPending && (
        <Alert severity="info">Entrenando y evaluando el modelo con todos los datos. Puede tardar un buen rato; no cierres esta página.</Alert>
      )}

      {modelo.isPending && <Skeleton variant="rounded" height={160} />}

      {modelo.data && !disponible && (
        <Paper variant="outlined" sx={{ p: 3 }}>
          <Stack spacing={2} sx={{ alignItems: 'flex-start' }}>
            <Typography variant="h6" component="h2">
              El modelo aún no se ha entrenado
            </Typography>
            <Typography color="text.secondary">
              {esAdmin
                ? 'Entrénalo una vez: se evalúa con validación cruzada, se guarda en el servidor y queda disponible para todos.'
                : 'Un administrador debe entrenarlo primero. Vuelve a intentarlo más tarde.'}
            </Typography>
            {botonEntrenar}
          </Stack>
        </Paper>
      )}

      {disponible && (
        <>
          {errorAtributos && <Alert severity="error">{errorAtributos}</Alert>}
          {atributos.isPending && <Skeleton variant="rounded" height={260} />}

          {atributos.data && (
            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, alignItems: 'start' }}>
              <FormularioPrediccion
                atributos={atributos.data}
                valores={valores}
                enviando={predecir.isPending}
                onCambio={cambiar}
                onPredecir={enviar}
                onLimpiar={limpiar}
              />
              <Stack spacing={2}>
                {errorPrediccion && <Alert severity="error">{errorPrediccion}</Alert>}
                {predecir.data && <ResultadoPrediccion resultado={predecir.data} atributos={atributos.data} />}
                {!predecir.data && !errorPrediccion && (
                  <Paper variant="outlined" sx={{ p: 2.5 }}>
                    <Typography color="text.secondary">
                      Elige los datos del estudiante y pulsa «Predecir» para ver el resultado aquí.
                    </Typography>
                  </Paper>
                )}
              </Stack>
            </Box>
          )}

          {modelo.data && <PanelModelo modelo={modelo.data} onVerArbol={() => setArbolAbierto(true)} />}
          <DialogoArbol abierto={arbolAbierto} onCerrar={() => setArbolAbierto(false)} />
        </>
      )}
    </Stack>
  )
}
