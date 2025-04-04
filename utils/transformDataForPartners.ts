export interface IFormattedStatisticsForDashboard {
  date: string
  sales: number
  clicks: number
}

export interface IStatisticsDataForDashboard {
  formattedStatistics: IFormattedStatisticsForDashboard[]
  totalPriceForSales?: number
  totalPriceForClicks?: number
}

export interface TStat {
  date: string
  firstLabel: number
  secondLabel: number
}

export const transformDataForPartners = (obj: IStatisticsDataForDashboard) => {
  const formattedStatistics: { [key: string]: TStat } = {}
  let totalForFirstLabel = 0
  let totalForSecondLabel = 0

  obj.formattedStatistics.forEach((stat: IFormattedStatisticsForDashboard) => {
    const date = stat.date.split(' ')[0]
    totalForFirstLabel += stat.sales
    totalForSecondLabel += stat.clicks

    if (!formattedStatistics[date]) {
      formattedStatistics[date] = { date, firstLabel: 0, secondLabel: 0 }
    }

    formattedStatistics[date].firstLabel += stat.sales
    formattedStatistics[date].secondLabel += stat.clicks
  })

  return {
    formattedStatistics: Object.values(formattedStatistics),
    totalForFirstLabel,
    firstLabel: 'Продажи',
    totalForSecondLabel,
    secondLabel: 'Переходы',
    isCurrencyLabel: false
  }
}
