import AdminIcon from '@mui/icons-material/AdminPanelSettings'
import ChatIcon from '@mui/icons-material/Chat'
import DashboardIcon from '@mui/icons-material/Dashboard'
import LogoutIcon from '@mui/icons-material/Logout'
import MenuIcon from '@mui/icons-material/Menu'
import SchoolIcon from '@mui/icons-material/School'
import TableIcon from '@mui/icons-material/TableChart'
import {
  AppBar,
  Box,
  Button,
  Chip,
  Container,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material'
import { useState, type ReactNode } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router'
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

/** Marco de las pantallas con sesión: barra superior con navegación, usuario y salida. */
export function AppShell() {
  const { usuario, esAdmin, logout } = useAuth()
  const navigate = useNavigate()
  const [ancla, setAncla] = useState<HTMLElement | null>(null)
  const items = ITEMS.filter((i) => !i.soloAdmin || esAdmin)

  return (
    <Box sx={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Toolbar sx={{ gap: 1 }}>
          <SchoolIcon color="primary" />
          <Typography variant="h6" component="span" sx={{ fontWeight: 600, mr: 2 }}>
            SaberData
          </Typography>

          {/* Navegación en pantallas medianas y grandes */}
          <Stack direction="row" spacing={0.5} sx={{ display: { xs: 'none', sm: 'flex' }, flexGrow: 1 }}>
            {items.map((i) => (
              <Button
                key={i.ruta}
                component={NavLink}
                to={i.ruta}
                end={i.ruta === '/'}
                startIcon={i.icono}
                color="inherit"
                sx={{ '&.active': { color: 'primary.main', bgcolor: 'action.selected' } }}
              >
                {i.etiqueta}
              </Button>
            ))}
          </Stack>

          <Box sx={{ flexGrow: { xs: 1, sm: 0 } }} />

          <Chip
            size="small"
            label={`${usuario?.username ?? ''}${esAdmin ? ' · ADMIN' : ''}`}
            sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
          />
          <Button
            color="inherit"
            onClick={logout}
            startIcon={<LogoutIcon />}
            sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
          >
            Salir
          </Button>

          {/* Menú desplegable en móvil */}
          <IconButton
            aria-label="Abrir menú"
            onClick={(e) => setAncla(e.currentTarget)}
            sx={{ display: { xs: 'inline-flex', sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Menu anchorEl={ancla} open={Boolean(ancla)} onClose={() => setAncla(null)}>
            {items.map((i) => (
              <MenuItem
                key={i.ruta}
                onClick={() => {
                  setAncla(null)
                  navigate(i.ruta)
                }}
              >
                <ListItemIcon>{i.icono}</ListItemIcon>
                {i.etiqueta}
              </MenuItem>
            ))}
            <MenuItem onClick={logout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Salir ({usuario?.username})
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Container component="main" maxWidth="lg" sx={{ flexGrow: 1, py: { xs: 2, sm: 4 } }}>
        <Outlet />
      </Container>
    </Box>
  )
}
