import {
  Alert,
  Box,
  Chip,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { describirError } from '../../api/client'
import { Insignia } from '../../components/Insignia'
import { useUsuarios } from './useUsuarios'

const formatoFecha = new Intl.DateTimeFormat('es-CO', { dateStyle: 'medium', timeStyle: 'short' })

/** Lista de usuarios registrados (solo ADMIN; el backend lo valida aunque se llegue por URL). */
export function UsuariosPage() {
  const consulta = useUsuarios()
  const usuarios = consulta.data
  const error = consulta.error ? describirError(consulta.error).mensaje : undefined

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" component="h1">
          Usuarios
        </Typography>
        <Typography color="text.secondary">
          {usuarios ? `${usuarios.length} usuarios registrados.` : 'Usuarios registrados en la plataforma.'}
        </Typography>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      <Paper variant="outlined">
        <TableContainer>
          <Table size="small" aria-label="Usuarios registrados">
            <TableHead>
              <TableRow>
                {['ID', 'Usuario', 'Correo', 'Rol', 'Estado', 'Registro'].map((t) => (
                  <TableCell key={t} sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
                    {t}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {consulta.isPending &&
                Array.from({ length: 4 }, (_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={6}>
                      <Skeleton variant="text" />
                    </TableCell>
                  </TableRow>
                ))}
              {usuarios?.map((u) => (
                <TableRow key={u.id} hover>
                  <TableCell>{u.id}</TableCell>
                  <TableCell>{u.username}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={u.rol}
                      color={u.rol === 'ADMIN' ? 'primary' : 'default'}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Insignia texto={u.activo ? 'Activo' : 'Inactivo'} tono={u.activo ? 'azul' : 'naranja'} />
                  </TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatoFecha.format(new Date(u.creadoEn))}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Stack>
  )
}
