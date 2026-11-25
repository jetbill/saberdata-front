import { createTheme } from '@mui/material/styles'

/**
 * Tokens de diseño de la app (propuesta B: consola oscura con barra lateral).
 * Los componentes no fijan colores a mano; los toman de aquí.
 */
export const colores = {
  fondo: '#0b0f14',
  panel: '#121821',
  lateral: '#0e131a',
  linea: '#1f2933',
  lineaSuave: '#18212b',
  filaPar: '#0f151d',
  filaHover: '#13202c',
  tinta: '#e6edf3',
  tintaSuave: '#9aa7b4',
  azul: '#38bdf8',
  azulFondo: '#10283a',
  azulBorde: '#17445e',
  azulInsignia: '#0f3347',
  naranja: '#fb923c',
  naranjaInsignia: '#3a2412',
  /** Texto sobre superficies azules o naranjas. */
  sobreAcento: '#06121a',
  /** Rendimiento ALTO / BAJO (mismos colores en gráficos, indicadores y etiquetas). */
  alto: '#38bdf8',
  bajo: '#fb923c',
} as const

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: colores.azul, contrastText: colores.sobreAcento },
    secondary: { main: colores.naranja, contrastText: colores.sobreAcento },
    background: { default: colores.fondo, paper: colores.panel },
    text: { primary: colores.tinta, secondary: colores.tintaSuave },
    divider: colores.linea,
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: '"Manrope", "Segoe UI", system-ui, -apple-system, sans-serif',
    h4: { fontWeight: 800, fontSize: '1.875rem', letterSpacing: '-0.02em' },
    h5: { fontWeight: 800, letterSpacing: '-0.02em' },
    h6: { fontWeight: 700, fontSize: '1rem' },
    button: { fontWeight: 700, textTransform: 'none' },
    overline: { fontWeight: 700, letterSpacing: '0.08em', fontSize: '0.6875rem' },
  },
  components: {
    MuiButton: { defaultProps: { disableElevation: true } },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: { root: { backgroundImage: 'none', borderRadius: 14 } },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: colores.panel,
          fontWeight: 600,
          '& .MuiOutlinedInput-notchedOutline': { borderColor: colores.linea },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { borderBottom: `1px solid ${colores.lineaSuave}` },
        head: {
          backgroundColor: colores.lateral,
          borderBottom: `1px solid ${colores.linea}`,
          color: colores.tintaSuave,
          fontSize: '0.6875rem',
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        },
      },
    },
    MuiTableBody: {
      styleOverrides: {
        root: {
          '& .MuiTableRow-root:nth-of-type(even)': { backgroundColor: colores.filaPar },
          '& .MuiTableRow-root.MuiTableRow-hover:hover': { backgroundColor: colores.filaHover },
        },
      },
    },
    // Selector de agrupación del panel: pestañas dentro de una cápsula.
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: {
          gap: 6,
          padding: 4,
          width: 'max-content',
          maxWidth: '100%',
          backgroundColor: colores.lateral,
          border: `1px solid ${colores.linea}`,
          borderRadius: 10,
        },
        grouped: {
          border: 0,
          '&:not(:first-of-type), &:not(:last-of-type)': { borderRadius: 7, marginLeft: 0 },
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          borderRadius: 7,
          color: colores.tintaSuave,
          fontSize: '0.75rem',
          fontWeight: 700,
          '&.Mui-selected, &.Mui-selected:hover': { backgroundColor: colores.azulFondo, color: colores.azul },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: { '&.Mui-selected, &.Mui-selected:hover': { backgroundColor: colores.azulFondo, color: colores.azul } },
      },
    },
  },
})
