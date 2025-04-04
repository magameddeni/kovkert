import moment from 'moment'

export const getDayFromStringDate = (value: string) => {
  const date = moment(value, 'YYYY-MM-DD')
  return date.format('dddd')
}
