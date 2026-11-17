import { keepPreviousData, useQuery } from '@tanstack/react-query'
import type { FiltrosResultados } from '../../api/tipos'
import { useRendimientoPor } from '../estadisticas/useEstadisticas'
import { resultadosApi } from './resultadosApi'

/** Página de resultados; conserva la anterior mientras llega la siguiente para que la tabla no parpadee. */
export function useResultados(filtros: FiltrosResultados) {
  return useQuery({
    queryKey: ['resultados', filtros],
    queryFn: ({ signal }) => resultadosApi.buscar(filtros, signal),
    placeholderData: keepPreviousData,
  })
}

/**
 * Opciones de los filtros. El backend filtra por coincidencia exacta, así que se toman de las
 * agrupaciones de estadísticas (ya en caché por el panel): garantiza valores que sí existen.
 */
export function useOpcionesFiltros() {
  const estrato = useRendimientoPor('estrato')
  const jornada = useRendimientoPor('jornada')
  const naturaleza = useRendimientoPor('naturaleza')
  const departamento = useRendimientoPor('departamento')
  const nombres = (d?: { grupo: string }[]) =>
    (d ?? []).map((g) => g.grupo).sort((a, b) => a.localeCompare(b, 'es'))
  return {
    estrato: nombres(estrato.data),
    jornada: nombres(jornada.data),
    naturaleza: nombres(naturaleza.data),
    departamento: nombres(departamento.data),
  }
}
