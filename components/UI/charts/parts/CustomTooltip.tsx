import React from 'react'
import { getDayFromStringDate } from 'utils/getDayFromStringDate'
import { getRussianDay } from 'utils/getRussianDay'
import moment from 'moment'
import s from './style.module.scss'

const CustomTooltip = ({ active, payload, label }: { active: boolean; payload: any[]; label: string }) => {
  const englishDay = getDayFromStringDate(label)
  const russianDay = getRussianDay(englishDay)
  if (active && payload && payload.length) {
    return (
      <div className={s['custom-tooltip']}>
        <p className={s['custom-tooltip__label']}>{`${moment(label, 'YYYY-MM-DD').format('DD.MM')}, ${russianDay}`}</p>
        <p className={s['custom-tooltip__intro-up']}>{payload[0].value} ₽</p>
        <p className={s['custom-tooltip__intro-down']}>{payload[1].value} ₽</p>
      </div>
    )
  }
  return <></>
}
export default CustomTooltip
