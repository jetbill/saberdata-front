import {
  Alert,
  Box,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { describirError } from '../../api/client'
import type { FiltrosResultados, Resultado } from '../../api/tipos'
import { Insignia } from '../../components/Insignia'
import { BarraFiltros } from './BarraFiltros'
import { useOpcionesFiltros, useResultados } from './useResultados'

const TAMANOS = [10, 20, 50, 100]

const COLUMNAS: { titulo: string; valor: (r: Resultado) => string; siNo?: boolean }[] = [
  { titulo: 'ID', valor: (r) => String(r.id) },
  { titulo: 'Género', valor: (r) => r.genero },
  { titulo: 'Depto. residencia', valor: (r) => r.deptoResidencia },
  { titulo: 'Estrato', valor: (r) => r.estrato },
  { titulo: 'Educación madre', valor: (r) => r.educacionMadre },
  { titulo: 'Internet', valor: (r) => r.tieneInternet, siNo: true },
  { titulo: 'Computador', valor: (r) => r.tieneComputador, siNo: true },
  { titulo: 'Naturaleza', valor: (r) => r.naturalezaColegio },
  { titulo: 'Jornada', valor: (r) => r.jornada },
  { titulo: 'Depto. colegio', valor: (r) => r.deptoColegio },
]

/** Contenedor: guarda filtros y paginación; al cambiar un filtro vuelve a la primera página. */
export function ResultadosPage() {
  const [filtros, setFiltros] = useState<FiltrosResultados>({ page: 0, size: 20 })
  const consulta = useResultados(filtros)
  const opciones = useOpcionesFiltros()

  const cambiarFiltro = (cambio: Partial<FiltrosResultados>) =>
    setFiltros((f) => ({ ...f, ...cambio, page: 0 }))

  const pagina = consulta.data
  const error = consulta.error ? describirError(consulta.error).mensaje : undefined

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" component="h1">
          Resultados
        </Typography>
        <Typography color="text.secondary">
          {pagina
            ? `${pagina.totalElementos.toLocaleString('es-CO')} estudiantes con los filtros actuales.`
            : 'Consulta los registros individuales de Saber 11.'}
        </Typography>
      </Box>

      <BarraFiltros
        filtros={filtros}
        opciones={opciones}
        onChange={cambiarFiltro}
        onLimpiar={() => setFiltros((f) => ({ page: 0, size: f.size }))}
      />

      {error && <Alert severity="error">{error}</Alert>}

      <Paper variant="outlined">
        <TableContainer sx={{ opacity: consulta.isPlaceholderData ? 0.6 : 1, transition: 'opacity .15s' }}>
          <Table size="small" aria-label="Resultados Saber 11" sx={{ minWidth: 960 }}>
            <TableHead>
              <TableRow>
                {COLUMNAS.map((c) => (
                  <TableCell key={c.titulo} sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>
                    {c.titulo}
                  </TableCell>
                ))}
                <TableCell sx={{ fontWeight: 600 }}>Rendimiento</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {consulta.isPending &&
                Array.from({ length: 8 }, (_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={COLUMNAS.length + 1}>
                      <Skeleton variant="text" />
                    </TableCell>
                  </TableRow>
                ))}
              {pagina?.contenido.map((r) => (
                <TableRow key={r.id} hover>
                  {COLUMNAS.map((c) => (
                    <TableCell key={c.titulo} sx={{ whiteSpace: 'nowrap' }}>
                      {c.siNo ? (
                        <Insignia texto={c.valor(r)} tono={c.valor(r).toLowerCase() === 'si' ? 'azul' : 'naranja'} />
                      ) : (
                        c.valor(r)
                      )}
                    </TableCell>
                  ))}
                  <TableCell>
                    <Insignia
                      texto={r.rendimiento === 'ALTO' ? 'Alto' : 'Bajo'}
                      tono={r.rendimiento === 'ALTO' ? 'azul' : 'naranja'}
                    />
                  </TableCell>
                </TableRow>
              ))}
              {pagina?.contenido.length === 0 && (
                <TableRow>
                  <TableCell colSpan={COLUMNAS.length + 1} align="center" sx={{ py: 4 }}>
                    Ningún estudiante coincide con estos filtros.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={pagina?.totalElementos ?? 0}
          page={filtros.page ?? 0}
          rowsPerPage={filtros.size ?? 20}
          rowsPerPageOptions={TAMANOS}
          onPageChange={(_, p) => setFiltros((f) => ({ ...f, page: p }))}
          onRowsPerPageChange={(e) => setFiltros((f) => ({ ...f, size: Number(e.target.value), page: 0 }))}
          labelRowsPerPage="Filas por página"
          labelDisplayedRows={({ from, to, count }) => `${from}–${to} de ${count.toLocaleString('es-CO')}`}
        />
      </Paper>
    </Stack>
  )
}
