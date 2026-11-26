import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Skeleton } from '@mui/material'
import { describirError } from '../../api/client'
import { useArbol } from './useMineria'

/** Muestra el árbol J48 en texto. Solo pide el árbol al servidor cuando el diálogo está abierto. */
export function DialogoArbol({ abierto, onCerrar }: { abierto: boolean; onCerrar: () => void }) {
  const arbol = useArbol(abierto)

  return (
    <Dialog open={abierto} onClose={onCerrar} fullWidth maxWidth="lg" scroll="paper">
      <DialogTitle>Árbol de decisión (J48)</DialogTitle>
      <DialogContent dividers>
        {arbol.isPending && <Skeleton variant="rounded" height={240} />}
        {arbol.error && <Alert severity="error">{describirError(arbol.error).mensaje}</Alert>}
        {arbol.data && (
          <>
            {arbol.data.truncado && (
              <Alert severity="info" sx={{ mb: 2 }}>
                Se muestran las primeras líneas de {arbol.data.lineas}. Sube MINERIA_MIN_OBJ en el backend para obtener un
                árbol más pequeño.
              </Alert>
            )}
            <Box
              component="pre"
              sx={{ m: 0, fontFamily: 'Consolas, "Courier New", monospace', fontSize: 13, lineHeight: 1.5, overflowX: 'auto' }}
            >
              {arbol.data.texto}
            </Box>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onCerrar}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  )
}
