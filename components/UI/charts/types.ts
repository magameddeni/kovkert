export interface IFormattedStatistics {
  date: string
  firstLabel: number
  secondLabel: number
}

export interface IStatisticsData {
  formattedStatistics: IFormattedStatistics[]
  totalForFirstLabel: number
  totalForSecondLabel: number
  firstLabel: string
  secondLabel: string
  isCurrencyLabel?: boolean
}
