import AdminIcon from '@mui/icons-material/AdminPanelSettings'
import ChatIcon from '@mui/icons-material/ChatBubbleOutlined'
import DashboardIcon from '@mui/icons-material/SpaceDashboardOutlined'
import SchoolIcon from '@mui/icons-material/School'
import TableIcon from '@mui/icons-material/TableChartOutlined'
import { Box, ButtonBase, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import { NavLink, Outlet } from 'react-router'
import { colores } from '../app/theme'
import { useAuth } from '../features/auth/useAuth'

interface ItemMenu {
  ruta: string
  etiqueta: string
  icono: ReactNode
  soloAdmin?: boolean
}

const ITEMS: ItemMenu[] = [
  { ruta: '/', etiqueta: 'Panel', icono: <DashboardIcon fontSize="small" /> },
  { ruta: '/resultados', etiqueta: 'Resultados', icono: <TableIcon fontSize="small" /> },
  { ruta: '/chat', etiqueta: 'Asistente', icono: <ChatIcon fontSize="small" /> },
  { ruta: '/admin/usuarios', etiqueta: 'Usuarios', icono: <AdminIcon fontSize="small" />, soloAdmin: true },
]

/**
 * Marco de las pantallas con sesión: barra lateral con marca y navegación, y una franja
 * superior con el usuario y la salida. En pantallas estrechas la barra lateral pasa a ser
 * una franja horizontal sobre el contenido.
 */
export function AppShell() {
  const { usuario, esAdmin, logout } = useAuth()
  const items = ITEMS.filter((i) => !i.soloAdmin || esAdmin)

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '232px minmax(0, 1fr)' }, minHeight: '100dvh' }}>
      <Box
        component="aside"
        sx={{
          bgcolor: colores.lateral,
          borderRight: { md: `1px solid ${colores.linea}` },
          borderBottom: { xs: `1px solid ${colores.linea}`, md: 0 },
          p: { xs: '12px 16px', md: '24px 16px' },
          display: 'flex',
          flexDirection: { xs: 'row', md: 'column' },
          flexWrap: { xs: 'wrap', md: 'nowrap' },
          alignItems: { xs: 'center', md: 'stretch' },
          gap: 0.75,
          position: { md: 'sticky' },
          top: 0,
          height: { md: '100dvh' },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, px: 1.25, pb: { md: 2.5 }, mr: { xs: 1, md: 0 } }}>
          <SchoolIcon sx={{ color: colores.azul }} />
          <Typography component="span" sx={{ fontWeight: 800, fontSize: 18 }}>
            SaberData
          </Typography>
        </Box>

        {items.map((i) => (
          <ButtonBase
            key={i.ruta}
            component={NavLink}
            to={i.ruta}
            end={i.ruta === '/'}
            sx={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              gap: 1.5,
              px: 1.5,
              py: 1.375,
              borderRadius: '10px',
              fontFamily: 'inherit',
              fontSize: 14,
              fontWeight: 600,
              color: 'text.secondary',
              '&:hover': { bgcolor: '#151c25', color: 'text.primary' },
              '&.active': { bgcolor: colores.azulFondo, color: colores.azul },
            }}
          >
            {i.icono}
            {i.etiqueta}
          </ButtonBase>
        ))}
      </Box>

      <Box sx={{ minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <Box
          component="header"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 1.5,
            px: { xs: 2, md: 5 },
            py: 1.25,
            borderBottom: `1px solid ${colores.linea}`,
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          <Box
            aria-hidden
            sx={{
              width: 30,
              height: 30,
              borderRadius: '50%',
              bgcolor: '#1b2a3a',
              color: colores.azul,
              display: 'grid',
              placeItems: 'center',
              fontSize: 12,
              fontWeight: 700,
              textTransform: 'uppercase',
              flexShrink: 0,
            }}
          >
            {usuario?.username.charAt(0)}
          </Box>
          <Box component="span" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {usuario?.username}
            {esAdmin && (
              <Box component="span" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                {' · ADMIN'}
              </Box>
            )}
          </Box>
          <ButtonBase onClick={logout} sx={{ fontFamily: 'inherit', fontSize: 13, fontWeight: 500, color: 'text.secondary' }}>
            Salir
          </ButtonBase>
        </Box>

        <Box component="main" sx={{ minWidth: 0, flexGrow: 1, p: { xs: 2, md: '32px 40px 56px' } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}
