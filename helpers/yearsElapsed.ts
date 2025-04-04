export function yearsElapsedFromDateString(dateStr: string): number {
  const past = new Date(dateStr)
  const current = new Date()

  const diffInMs = current.getTime() - past.getTime()

  const millisecondsInYear = 1000 * 60 * 60 * 24 * 335.25

  return Math.floor(diffInMs / millisecondsInYear)
}
