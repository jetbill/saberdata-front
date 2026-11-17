import SendIcon from '@mui/icons-material/Send'
import { Alert, Box, IconButton, Paper, Skeleton, Stack, TextField, Typography } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { describirError } from '../../api/client'
import { BurbujaMensaje } from './BurbujaMensaje'
import { ListaConversaciones } from './ListaConversaciones'
import { useConversaciones, useCrearConversacion, useEnviarMensaje, useHistorial } from './useChat'

const MAX_CARACTERES = 2000

/** Contenedor del chat: conversación activa, historial persistido y respuesta en tiempo real. */
export function ChatPage() {
  const [seleccionada, setSeleccionada] = useState<string | null>(null)
  const [texto, setTexto] = useState('')
  const [errorCrear, setErrorCrear] = useState<string | null>(null)
  const finMensajes = useRef<HTMLDivElement>(null)

  const conversaciones = useConversaciones()
  const historial = useHistorial(seleccionada)
  const crear = useCrearConversacion()
  const { enviar, envio, error, enviando } = useEnviarMensaje()

  // Mantiene visible lo último que llega.
  useEffect(() => {
    finMensajes.current?.scrollIntoView({ block: 'end' })
  }, [historial.data, envio?.parcial, envio?.pregunta])

  const mensajeEnviable = texto.trim().length > 0 && !enviando && !crear.isPending

  async function manejarEnvio() {
    if (!mensajeEnviable) return
    const contenido = texto.trim()
    setErrorCrear(null)
    let id = seleccionada
    if (!id) {
      try {
        const nueva = await crear.mutateAsync(contenido.slice(0, 60))
        id = nueva.id
        setSeleccionada(id)
      } catch (e) {
        setErrorCrear(describirError(e).mensaje)
        return
      }
    }
    setTexto('')
    await enviar(id, contenido)
  }

  function alPulsarTecla(e: KeyboardEvent) {
    // Enter envía; Mayús+Enter inserta salto de línea.
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void manejarEnvio()
    }
  }

  const errorHistorial = historial.error ? describirError(historial.error).mensaje : null
  const sinMensajes = !envio && historial.data?.length === 0

  return (
    <Stack spacing={2}>
      <Box>
        <Typography variant="h4" component="h1">
          Asistente
        </Typography>
        <Typography color="text.secondary">
          Pregunta sobre los resultados Saber 11; responde con cifras reales de la base de datos.
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', md: '280px 1fr' },
          height: { xs: 'auto', md: 'calc(100dvh - 220px)' },
          minHeight: { md: 420 },
        }}
      >
        <Paper variant="outlined" sx={{ p: 1.5, maxHeight: { xs: 220, md: 'none' }, minHeight: 0 }}>
          <ListaConversaciones
            conversaciones={conversaciones.data}
            cargando={conversaciones.isPending}
            seleccionada={seleccionada}
            deshabilitada={enviando}
            onSeleccionar={setSeleccionada}
            onNueva={() => setSeleccionada(null)}
          />
        </Paper>

        <Paper variant="outlined" sx={{ display: 'flex', flexDirection: 'column', minHeight: { xs: 420, md: 0 } }}>
          <Stack spacing={1.5} sx={{ flex: 1, overflowY: 'auto', p: 2 }} aria-live="polite">
            {errorHistorial && <Alert severity="error">{errorHistorial}</Alert>}
            {seleccionada && historial.isPending && <Skeleton variant="rounded" height={80} />}
            {!seleccionada && !envio && (
              <Typography color="text.secondary" sx={{ m: 'auto', textAlign: 'center' }}>
                Escribe tu primera pregunta para empezar una conversación.
                <br />
                Ejemplo: «¿Cuál es el porcentaje de rendimiento alto en estrato 6?»
              </Typography>
            )}
            {sinMensajes && seleccionada && (
              <Typography color="text.secondary" sx={{ m: 'auto' }}>
                Esta conversación está vacía.
              </Typography>
            )}
            {historial.data?.map((m) => (
              <BurbujaMensaje key={m.id} rol={m.rol} contenido={m.contenido} />
            ))}
            {envio && (
              <>
                {/* Mientras se envía, el historial aún no incluye la pregunta ni la respuesta. */}
                <BurbujaMensaje rol="USER" contenido={envio.pregunta} />
                <BurbujaMensaje rol="ASSISTANT" contenido={envio.parcial} escribiendo />
              </>
            )}
            <div ref={finMensajes} />
          </Stack>

          {(error || errorCrear) && (
            <Alert severity="error" sx={{ mx: 2, mb: 1 }}>
              {error ?? errorCrear}
            </Alert>
          )}

          <Stack direction="row" spacing={1} sx={{ p: 2, pt: 1, alignItems: 'flex-end' }}>
            <TextField
              fullWidth
              multiline
              maxRows={5}
              size="small"
              placeholder="Escribe tu pregunta…"
              value={texto}
              onChange={(e) => setTexto(e.target.value.slice(0, MAX_CARACTERES))}
              onKeyDown={alPulsarTecla}
              helperText={texto.length > MAX_CARACTERES - 200 ? `${texto.length}/${MAX_CARACTERES}` : undefined}
            />
            <IconButton
              color="primary"
              aria-label="Enviar mensaje"
              onClick={() => void manejarEnvio()}
              disabled={!mensajeEnviable}
            >
              <SendIcon />
            </IconButton>
          </Stack>
        </Paper>
      </Box>
    </Stack>
  )
}
