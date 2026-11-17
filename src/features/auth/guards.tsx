import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from './useAuth'

/** Guardia de ruta: sin sesión, redirige al login recordando a dónde quería ir el usuario. */
export function RequiereSesion() {
  const { estaAutenticado } = useAuth()
  const ubicacion = useLocation()
  if (!estaAutenticado) {
    return <Navigate to="/login" replace state={{ desde: ubicacion.pathname + ubicacion.search }} />
  }
  return <Outlet />
}

/** Guardia por rol: solo deja pasar a ADMIN. (El backend vuelve a validarlo en cada petición.) */
export function RequiereAdmin() {
  const { esAdmin } = useAuth()
  return esAdmin ? <Outlet /> : <Navigate to="/" replace />
}

/**
 * Para login y registro: quien ya tiene sesión sale de allí, hacia la página que quería visitar
 * (la que guardó {@link RequiereSesion}) o hacia el panel. Así el login no necesita navegar a mano.
 */
export function SoloInvitados() {
  const { estaAutenticado } = useAuth()
  const ubicacion = useLocation()
  if (estaAutenticado) {
    const desde = (ubicacion.state as { desde?: string } | null)?.desde
    return <Navigate to={desde ?? '/'} replace />
  }
  return <Outlet />
}
