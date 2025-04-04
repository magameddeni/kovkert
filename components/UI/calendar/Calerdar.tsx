import React, { useEffect, useState } from 'react'
import DatePicker, { registerLocale } from 'react-datepicker'
import { ru } from 'date-fns/locale/ru'
import cx from 'classnames'
import s from '../form/style.module.scss'
import 'react-datepicker/dist/react-datepicker.css'
import FormLabel from '../form/FormLabel'
import FormError from '../form/FormError'

registerLocale('ru', ru)

interface ICalendarProps {
  id?: string
  name?: string
  startDate?: Date
  endDate?: Date
  onChange?: (start?: any, end?: any) => void
  maxDate?: Date
  label?: string
  isShowCalendar?: boolean
  classNamesWrapper?: string
  icon?: string | React.ReactElement<any, string | React.JSXElementConstructor<any>> | undefined
  placeholderText?: string
  dateFormat?: string
  fluid?: boolean
  selectsRange?: boolean
  showYearDropdown?: boolean
  showMonthDropdown?: boolean
  yearDropdownItemNumber?: number
  view?: 'auth'
  required?: boolean
  rules?: any
  errors?: any
}

const Calendar = ({
  id,
  name = '',
  startDate,
  endDate,
  onChange,
  maxDate,
  label,
  isShowCalendar = false,
  classNamesWrapper,
  icon,
  fluid,
  dateFormat = 'd MMMM yy',
  selectsRange,
  view,
  required,
  rules,
  errors,
  ...props
}: ICalendarProps) => {
  const [startDataCurrent, setStartDataCurrent] = useState<Date | null>(startDate || new Date())
  const [endDataCurrent, setEndDataCurrent] = useState<Date | null>(endDate || new Date())
  const [isRequired, setIsRequired] = useState<boolean>(false)

  const formInputWrapperClassList = cx(
    s['form-input-wrapper'],
    ['calendar-wrapper'],
    {
      [s[`view-${view}`]]: view,
      [s.fluid]: fluid,
      active: Boolean(startDataCurrent),
      error: errors?.[name],
      [`view-${view}`]: view,
      fluid
    },
    classNamesWrapper
  )

  const onChangeHandler = (dates: any) => {
    if (selectsRange) {
      const [start, end] = dates

      setStartDataCurrent(start)
      setEndDataCurrent(end)

      if (onChange) onChange(start, end)
      return
    }

    setStartDataCurrent(dates)

    if (onChange) onChange(dates)
  }

  const clearCalendarValue = () => {
    setStartDataCurrent(null)
    setEndDataCurrent(null)
  }

  useEffect(() => {
    if (!startDate && !endDate) clearCalendarValue()
  }, [startDate, endDate])

  useEffect(() => {
    setIsRequired(required || rules?.required?.value)
  }, [])

  return (
    <label htmlFor={id} className={formInputWrapperClassList}>
      <FormLabel label={label} required={isRequired} />
      <div className={s['input-container']}>
        <DatePicker
          id={id}
          locale='ru'
          selected={startDataCurrent}
          onChange={onChangeHandler}
          startDate={startDataCurrent || undefined}
          // @ts-ignore
          endDate={selectsRange ? endDataCurrent : undefined}
          maxDate={maxDate || new Date()}
          inline={isShowCalendar}
          icon={icon}
          showIcon={Boolean(icon)}
          dateFormat={dateFormat}
          // @ts-ignore
          selectsRange={selectsRange}
          toggleCalendarOnIconClick
          {...props}
        />
      </div>
      <FormError message={errors?.[name]?.message || errors?.[name]} />
    </label>
  )
}

export default Calendar
