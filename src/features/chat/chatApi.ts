import { cabeceras, construirUrl, errorDeRed, errorDeRespuesta, peticion } from '../../api/client'
import type { Conversacion, Mensaje } from '../../api/tipos'

const BASE = '/api/chat/conversaciones'

/** Acceso HTTP al chat. La respuesta del asistente llega por streaming (ver {@link enviarEnStreaming}). */
export const chatApi = {
  listar: (signal?: AbortSignal) => peticion<Conversacion[]>(BASE, { signal }),

  crear: (titulo?: string) => peticion<Conversacion>(BASE, { method: 'POST', body: { titulo } }),

  historial: (id: string, signal?: AbortSignal) => peticion<Mensaje[]>(`${BASE}/${id}/mensajes`, { signal }),
}

/**
 * Envía un mensaje y entrega la respuesta trozo a trozo mediante `onTrozo`.
 *
 * `EventSource` no sirve aquí (solo hace GET y no admite cabecera Authorization), así que se lee el
 * cuerpo SSE del `fetch` con un `ReadableStream` y se interpreta el formato a mano.
 */
export async function enviarEnStreaming(
  id: string,
  contenido: string,
  onTrozo: (trozo: string) => void,
  signal?: AbortSignal,
): Promise<void> {
  const headers = { ...cabeceras(true, true), Accept: 'text/event-stream' }

  let respuesta: Response
  try {
    respuesta = await fetch(construirUrl(`${BASE}/${id}/mensajes/stream`), {
      method: 'POST',
      headers,
      body: JSON.stringify({ contenido }),
      signal,
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error
    throw errorDeRed()
  }

  // Errores previos al stream (404, 503 si Ollama no responde…) llegan como JSON normal.
  if (!respuesta.ok) throw await errorDeRespuesta(respuesta, true)
  if (!respuesta.body) throw errorDeRed()

  const lector = respuesta.body.pipeThrough(new TextDecoderStream()).getReader()
  let pendiente = ''
  try {
    for (;;) {
      const { done, value } = await lector.read()
      if (done) break
      pendiente += value
      // Los eventos se separan con una línea en blanco.
      const eventos = pendiente.split(/\r?\n\r?\n/)
      pendiente = eventos.pop() ?? ''
      for (const evento of eventos) emitir(evento, onTrozo)
    }
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error
    throw errorDeRed()
  }
  if (pendiente.trim()) emitir(pendiente, onTrozo)
}

/**
 * Extrae el texto de un evento SSE. Spring no añade espacio tras `data:`, así que NO se recorta:
 * un trozo como " hola" conserva su espacio inicial (el estándar quitaría uno).
 */
function emitir(evento: string, onTrozo: (trozo: string) => void): void {
  const lineas = evento.split(/\r?\n/).filter((l) => l.startsWith('data:'))
  if (lineas.length === 0) return
  onTrozo(lineas.map((l) => l.slice(5)).join('\n'))
}
