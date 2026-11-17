import { Box, Button, MenuItem, TextField } from '@mui/material'
import type { FiltrosResultados, Rendimiento } from '../../api/tipos'

type Opciones = Record<'estrato' | 'jornada' | 'naturaleza' | 'departamento', string[]>

const CAMPOS: { clave: keyof Opciones; etiqueta: string }[] = [
  { clave: 'estrato', etiqueta: 'Estrato' },
  { clave: 'jornada', etiqueta: 'Jornada' },
  { clave: 'naturaleza', etiqueta: 'Naturaleza' },
  { clave: 'departamento', etiqueta: 'Departamento' },
]

/** Presentacional: muestra los filtros y avisa los cambios; no sabe nada de la API. */
export function BarraFiltros({
  filtros,
  opciones,
  onChange,
  onLimpiar,
}: {
  filtros: FiltrosResultados
  opciones: Opciones
  onChange: (cambio: Partial<FiltrosResultados>) => void
  onLimpiar: () => void
}) {
  const hayFiltros = CAMPOS.some((c) => filtros[c.clave]) || filtros.rendimiento

  return (
    <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(5, 1fr) auto' } }}>
      {CAMPOS.map(({ clave, etiqueta }) => (
        <TextField
          key={clave}
          select
          size="small"
          label={etiqueta}
          value={filtros[clave] ?? ''}
          onChange={(e) => onChange({ [clave]: e.target.value || undefined })}
        >
          <MenuItem value="">Todos</MenuItem>
          {opciones[clave].map((o) => (
            <MenuItem key={o} value={o}>
              {o}
            </MenuItem>
          ))}
        </TextField>
      ))}
      <TextField
        select
        size="small"
        label="Rendimiento"
        value={filtros.rendimiento ?? ''}
        onChange={(e) => onChange({ rendimiento: (e.target.value || undefined) as Rendimiento | undefined })}
      >
        <MenuItem value="">Todos</MenuItem>
        <MenuItem value="ALTO">Alto</MenuItem>
        <MenuItem value="BAJO">Bajo</MenuItem>
      </TextField>
      <Button onClick={onLimpiar} disabled={!hayFiltros}>
        Limpiar
      </Button>
    </Box>
  )
}
