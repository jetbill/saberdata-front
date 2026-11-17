import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useRef, useState } from 'react'
import { describirError } from '../../api/client'
import { chatApi, enviarEnStreaming } from './chatApi'

export function useConversaciones() {
  return useQuery({
    queryKey: ['chat', 'conversaciones'],
    queryFn: ({ signal }) => chatApi.listar(signal),
  })
}

export function useHistorial(id: string | null) {
  return useQuery({
    queryKey: ['chat', 'historial', id],
    queryFn: ({ signal }) => chatApi.historial(id as string, signal),
    enabled: id !== null,
  })
}

export function useCrearConversacion() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (titulo?: string) => chatApi.crear(titulo),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['chat', 'conversaciones'] }),
  })
}

export interface EnvioEnCurso {
  pregunta: string
  /** Texto de la respuesta recibido hasta ahora. */
  parcial: string
}

/**
 * Envía un mensaje y va acumulando la respuesta del asistente a medida que llega.
 * Al terminar recarga el historial desde el servidor, que es la fuente de verdad.
 */
export function useEnviarMensaje() {
  const qc = useQueryClient()
  const [envio, setEnvio] = useState<EnvioEnCurso | null>(null)
  const [error, setError] = useState<string | null>(null)
  const control = useRef<AbortController | null>(null)

  useEffect(() => () => control.current?.abort(), [])

  const enviar = useCallback(
    async (conversacionId: string, contenido: string) => {
      control.current?.abort()
      const abort = new AbortController()
      control.current = abort
      setError(null)
      setEnvio({ pregunta: contenido, parcial: '' })

      try {
        await enviarEnStreaming(
          conversacionId,
          contenido,
          (trozo) => setEnvio((e) => (e ? { ...e, parcial: e.parcial + trozo } : e)),
          abort.signal,
        )
      } catch (e) {
        if (!(e instanceof DOMException && e.name === 'AbortError')) {
          setError(describirError(e).mensaje)
        }
      } finally {
        if (control.current === abort) {
          // Se recarga también si falló: el mensaje del usuario pudo quedar guardado.
          await qc.invalidateQueries({ queryKey: ['chat', 'historial', conversacionId] })
          setEnvio(null)
        }
      }
    },
    [qc],
  )

  return { enviar, envio, error, enviando: envio !== null }
}
