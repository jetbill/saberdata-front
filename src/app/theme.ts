import { createTheme } from '@mui/material/styles'

/**
 * Tema único de la app (design tokens): colores, tipografía y forma de los componentes.
 * Los componentes no fijan colores a mano; los toman de aquí. Claro y oscuro siguen al sistema.
 */
export const theme = createTheme({
  cssVariables: { colorSchemeSelector: 'class' },
  colorSchemes: {
    light: {
      palette: {
        primary: { main: '#1d4ed8' },
        secondary: { main: '#0f766e' },
        background: { default: '#f5f7fb' },
      },
    },
    dark: {
      palette: {
        primary: { main: '#7aa2ff' },
        secondary: { main: '#4fd1c5' },
      },
    },
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: '"Roboto", "Segoe UI", system-ui, -apple-system, sans-serif',
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
  },
  components: {
    MuiButton: { defaultProps: { disableElevation: true }, styleOverrides: { root: { textTransform: 'none' } } },
    MuiPaper: { defaultProps: { elevation: 0 } },
  },
})
