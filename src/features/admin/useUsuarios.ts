import { useQuery } from '@tanstack/react-query'
import { adminApi } from './adminApi'

export function useUsuarios() {
  return useQuery({
    queryKey: ['admin', 'usuarios'],
    queryFn: ({ signal }) => adminApi.usuarios(signal),
  })
}
