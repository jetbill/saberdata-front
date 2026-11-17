import { useQuery } from '@tanstack/react-query'
import type { Agrupacion } from '../../api/tipos'
import { estadisticasApi } from './estadisticasApi'

// Los datos del ICFES son estáticos: se conservan en caché 10 minutos.
const FRESCURA_MS = 10 * 60 * 1000

export function useResumen() {
  return useQuery({
    queryKey: ['estadisticas', 'resumen'],
    queryFn: ({ signal }) => estadisticasApi.resumen(signal),
    staleTime: FRESCURA_MS,
  })
}

export function useRendimientoPor(agrupacion: Agrupacion) {
  return useQuery({
    queryKey: ['estadisticas', 'rendimiento', agrupacion],
    queryFn: ({ signal }) => estadisticasApi.rendimientoPor(agrupacion, signal),
    staleTime: FRESCURA_MS,
  })
}
