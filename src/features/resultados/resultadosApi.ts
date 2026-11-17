import { peticion } from '../../api/client'
import type { FiltrosResultados, Pagina, Resultado } from '../../api/tipos'

/** Acceso HTTP a /api/resultados. Los filtros vacíos se omiten en la URL (lo hace el cliente). */
export const resultadosApi = {
  buscar: (filtros: FiltrosResultados, signal?: AbortSignal) =>
    peticion<Pagina<Resultado>>('/api/resultados', { params: { ...filtros }, signal }),
}
