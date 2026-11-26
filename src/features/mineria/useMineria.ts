import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { mineriaApi } from './mineriaApi'

export function useModelo() {
  return useQuery({
    queryKey: ['mineria', 'modelo'],
    queryFn: ({ signal }) => mineriaApi.modelo(signal),
  })
}

/** Atributos y valores del modelo; solo se piden cuando ya hay un modelo entrenado (si no, el backend responde 503). */
export function useAtributos(modeloDisponible: boolean) {
  return useQuery({
    queryKey: ['mineria', 'atributos'],
    queryFn: ({ signal }) => mineriaApi.atributos(signal),
    enabled: modeloDisponible,
    staleTime: 10 * 60 * 1000,
  })
}

/** El árbol puede ser largo: solo se pide cuando el usuario abre el diálogo. */
export function useArbol(abierto: boolean) {
  return useQuery({
    queryKey: ['mineria', 'arbol'],
    queryFn: ({ signal }) => mineriaApi.arbol(signal),
    enabled: abierto,
  })
}

export function usePredecir() {
  return useMutation({ mutationFn: (atributos: Record<string, string>) => mineriaApi.predecir(atributos) })
}

/** Reentrena el modelo; al terminar se recargan sus métricas, atributos y árbol. */
export function useEntrenar() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => mineriaApi.entrenar(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['mineria'] }),
  })
}
