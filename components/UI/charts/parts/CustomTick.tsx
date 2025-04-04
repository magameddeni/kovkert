import moment from 'moment'
import React from 'react'
import { Text } from 'recharts'
import { getDayFromStringDate } from 'utils/getDayFromStringDate'

const CustomTick = (e: any) => {
  const {
    payload: { value }
  } = e
  e.fill = getDayFromStringDate(value) === 'Monday' ? '#5E6774' : '#BDBEBF'
  return <Text {...e}>{moment(value, 'YYYY-MM-DD').format('DD.MM')}</Text>
}

export default CustomTick
