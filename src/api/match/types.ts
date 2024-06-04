export interface Body {
  data: Data
}

export interface Data {
  matchDuration: number
  teamA: TeamA
  teamB: TeamB
}

export interface TeamA {
  playerMetrics: PlayerMetrics[]
}

export interface TeamB {
  playerMetrics: PlayerMetrics[]
}


export interface PlayerMetrics {
  "tiempo-en-ataque": number
  "tiempo-en-defensa": number
  "tiempo-en-zona-media": number
  "zona-de-devoluciones-de-golpe": number
  "velocidad-de-golpe-en-defensa": number
  "velocidad-de-golpe-en-ataque": number
  "velocidad-de-saque": number
  "1o-saque-valido": number
  "2o-saque-valido": number
  "distribucion-de-saque": number
  "total-de-tiros": number
  "porcentaje-de-tiros-ganadores": number
  "numero-de-tiros-ganadores": number
  "porcentaje-de-errores-no-forzados": number
  "numero-de-errores-no-forzados": number
  "relacion-errores-vs-tiros-ganadores": number
  "eficiencia-en-la-red": number
  globo: number
  "golpe-de-fondo": number
  volea: number
  "bandeja-vibora": number
  remate: number
}

export const GroupByOptions = [
  'month',
  'year',
]

export const FormatBasedOnGroupBy = {
  month: 'MMMM',
  year: 'YYYY'
}