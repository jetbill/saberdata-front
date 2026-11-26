/** Proporción (0–1) como porcentaje con formato colombiano, p. ej. 0,6018 → «60,2 %». */
export const porcentaje = (x: number, decimales = 1) =>
  `${(x * 100).toLocaleString('es-CO', { maximumFractionDigits: decimales })} %`

export const decimal = (x: number, decimales = 3) =>
  x.toLocaleString('es-CO', { maximumFractionDigits: decimales })
