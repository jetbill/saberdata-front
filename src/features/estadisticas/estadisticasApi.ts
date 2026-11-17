import { peticion } from '../../api/client'
import type { Agrupacion, GrupoRendimiento, Resumen } from '../../api/tipos'

/** Acceso HTTP a /api/estadisticas. Solo transporta datos; no conoce la interfaz. */
export const estadisticasApi = {
  resumen: (signal?: AbortSignal) => peticion<Resumen>('/api/estadisticas/resumen', { signal }),

  rendimientoPor: (agrupacion: Agrupacion, signal?: AbortSignal) =>
    peticion<GrupoRendimiento[]>(`/api/estadisticas/rendimiento-por-${agrupacion}`, { signal }),
}
