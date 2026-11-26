import { peticion } from '../../api/client'
import type { ArbolModelo, AtributoModelo, Modelo, Prediccion } from '../../api/tipos'

/** Acceso HTTP a la minería de datos. `entrenar` solo lo acepta el backend para el rol ADMIN. */
export const mineriaApi = {
  modelo: (signal?: AbortSignal) => peticion<Modelo>('/api/mineria/modelo', { signal }),

  atributos: (signal?: AbortSignal) => peticion<AtributoModelo[]>('/api/mineria/atributos', { signal }),

  arbol: (signal?: AbortSignal) => peticion<ArbolModelo>('/api/mineria/arbol', { signal }),

  predecir: (atributos: Record<string, string>) =>
    peticion<Prediccion>('/api/mineria/prediccion', { method: 'POST', body: { atributos } }),

  entrenar: () => peticion<Modelo>('/api/admin/mineria/entrenar', { method: 'POST' }),
}
