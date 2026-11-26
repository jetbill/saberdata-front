import { Route, Routes } from 'react-router'
import { AppShell } from '../components/AppShell'
import { NoEncontradaPage } from '../components/NoEncontradaPage'
import { UsuariosPage } from '../features/admin/UsuariosPage'
import { RequiereAdmin, RequiereSesion, SoloInvitados } from '../features/auth/guards'
import { LoginPage } from '../features/auth/LoginPage'
import { RegisterPage } from '../features/auth/RegisterPage'
import { ChatPage } from '../features/chat/ChatPage'
import { DashboardPage } from '../features/estadisticas/DashboardPage'
import { PrediccionPage } from '../features/mineria/PrediccionPage'
import { ResultadosPage } from '../features/resultados/ResultadosPage'

/** Mapa de rutas. Las guardias envuelven grupos de rutas: sesión, rol ADMIN o solo invitados. */
export function App() {
  return (
    <Routes>
      <Route element={<SoloInvitados />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />
      </Route>

      <Route element={<RequiereSesion />}>
        <Route element={<AppShell />}>
          <Route index element={<DashboardPage />} />
          <Route path="resultados" element={<ResultadosPage />} />
          <Route path="prediccion" element={<PrediccionPage />} />
          <Route path="chat" element={<ChatPage />} />
          <Route element={<RequiereAdmin />}>
            <Route path="admin/usuarios" element={<UsuariosPage />} />
          </Route>
          <Route path="*" element={<NoEncontradaPage />} />
        </Route>
      </Route>
    </Routes>
  )
}
