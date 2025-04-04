export const getRussianDay = (englishDay: string): string => {
  const daysMap: { [key: string]: string } = {
    monday: 'Понедельник',
    tuesday: 'Вторник',
    wednesday: 'Среда',
    thursday: 'Четверг',
    friday: 'Пятница',
    saturday: 'Суббота',
    sunday: 'Воскресенье'
  }

  return daysMap[englishDay.toLowerCase()] || ''
}
