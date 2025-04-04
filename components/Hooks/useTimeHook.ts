function useTimeHook(date: Date) {
  const time = new Date(date)
  const dayFormatLong = Intl.DateTimeFormat('ru', { day: 'numeric' })
  const dayFormatString = Intl.DateTimeFormat('ru', { day: '2-digit' })
  const monthFormatLong = Intl.DateTimeFormat('ru', { month: 'long' })
  const monthFormatNumeric = Intl.DateTimeFormat('ru', { month: '2-digit' })
  const yearFormatLong = Intl.DateTimeFormat('ru', { year: 'numeric' })
  const yearFormatNumeric = Intl.DateTimeFormat('ru', { year: '2-digit' })
  const hourFormat = Intl.DateTimeFormat('ru', { hour: 'numeric' })
  const minuteFormat = Intl.DateTimeFormat('ru', { minute: '2-digit' })
  const dayLong = dayFormatLong.format(time)
  const day = dayFormatString.format(time)
  const monthLong = monthFormatLong.format(time)
  const month = monthFormatNumeric.format(time)
  const yearLong = yearFormatLong.format(time)
  const year = yearFormatNumeric.format(time)
  const hour = hourFormat.format(time)
  const minute = minuteFormat.format(time)

  return { dayLong, day, month, monthLong, yearLong, year, hour, minute }
}

export default useTimeHook
