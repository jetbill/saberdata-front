import AddIcon from '@mui/icons-material/Add'
import { Button, List, ListItemButton, ListItemText, Skeleton, Stack, Typography } from '@mui/material'
import type { Conversacion } from '../../api/tipos'

/** Presentacional: lista de conversaciones con el botón de crear una nueva. */
export function ListaConversaciones({
  conversaciones,
  cargando,
  seleccionada,
  deshabilitada,
  onSeleccionar,
  onNueva,
}: {
  conversaciones?: Conversacion[]
  cargando: boolean
  seleccionada: string | null
  deshabilitada: boolean
  onSeleccionar: (id: string) => void
  onNueva: () => void
}) {
  return (
    <Stack spacing={1} sx={{ height: '100%', minHeight: 0 }}>
      <Button variant="outlined" startIcon={<AddIcon />} onClick={onNueva} disabled={deshabilitada}>
        Nueva conversación
      </Button>
      <List dense disablePadding sx={{ overflowY: 'auto', flex: 1 }}>
        {cargando && <Skeleton variant="rounded" height={120} />}
        {conversaciones?.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ p: 1 }}>
            Aún no tienes conversaciones.
          </Typography>
        )}
        {conversaciones?.map((c) => (
          <ListItemButton
            key={c.id}
            selected={c.id === seleccionada}
            disabled={deshabilitada && c.id !== seleccionada}
            onClick={() => onSeleccionar(c.id)}
            sx={{ borderRadius: 1 }}
          >
            <ListItemText
              primary={c.titulo || 'Sin título'}
              secondary={new Date(c.creadaEn).toLocaleDateString('es-CO')}
              slotProps={{ primary: { noWrap: true } }}
            />
          </ListItemButton>
        ))}
      </List>
    </Stack>
  )
}
