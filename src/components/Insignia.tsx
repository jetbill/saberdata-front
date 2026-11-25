import { Box } from '@mui/material'
import { colores } from '../app/theme'

/** Etiqueta redondeada: azul para lo positivo (alto, sí, activo), naranja para lo contrario. */
export function Insignia({ texto, tono }: { texto: string; tono: 'azul' | 'naranja' }) {
  const azul = tono === 'azul'
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-block',
        px: 1.25,
        py: 0.25,
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 700,
        bgcolor: azul ? colores.azulInsignia : colores.naranjaInsignia,
        color: azul ? colores.azul : colores.naranja,
      }}
    >
      {texto}
    </Box>
  )
}
