import React, { useRef, useState } from 'react'
import cx from 'classnames'
import { Calendar, Icon, Text } from 'components/UI'

import useMediaQuery from '@/components/Hooks/useMediaQuery'
import s from './styles.module.scss'

const monthsAbbreviated = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']

interface DateFilterProps {
  onFilterChange: (startDate: string | null, endDate?: string) => void
  disabled?: boolean
  label?: string
  position?: string
}

const DateFilter: React.FC<DateFilterProps> = ({
  onFilterChange,
  disabled,
  label = 'Дата заказа',
  position = 'left'
}) => {
  const isMobile = useMediaQuery('(max-width:767px)')
  const [openDropdown, setOpenDropdown] = useState<boolean>(false)
  const [dataFilter, setDataFilter] = useState<any>([new Date()])
  const filterWrapRef = useRef(null)
  const dataFilterFilled = dataFilter[0] && dataFilter?.[1]

  const onChangeCalendar = (startDate: Date, endDate: Date) => {
    setDataFilter([startDate, endDate])

    if (startDate && endDate) {
      setOpenDropdown(false)

      const date = new Date()
      const todayDaySum = date.getDate() + date.getMonth() + date.getFullYear()
      const startDateSum = startDate.getDate() + startDate.getMonth() + startDate.getFullYear()
      const endDateSum = endDate.getDate() + endDate.getMonth() + endDate.getFullYear()

      if (todayDaySum === startDateSum && todayDaySum === endDateSum) {
        onFilterChange(new Date(date.getFullYear(), date.getMonth(), date.getDate()).toISOString(), date.toISOString())
      } else if (startDateSum === endDateSum) {
        startDate.setHours(0, 0, 0)
        endDate.setDate(endDate.getDate() + 1)
        endDate.setHours(0, 0, 0)

        onFilterChange(startDate.toISOString(), endDate.toISOString())
      } else {
        startDate.setHours(0, 0, 0)
        endDate.setHours(0, 0, 0)

        onFilterChange(startDate.toISOString(), endDate.toISOString())
      }
    }
  }

  const onClickOutside = (e: any) => {
    const element = e.target
    const nextMonthCalendarButtonClassNames = 'react-datepicker__navigation react-datepicker__navigation--next'
    const outsideMonthClassName = 'react-datepicker__day--outside-month'

    if (
      nextMonthCalendarButtonClassNames === element.className ||
      String(element?.className).includes(outsideMonthClassName)
    )
      return

    // @ts-ignore
    if (filterWrapRef.current && !filterWrapRef.current?.contains(element)) {
      e.preventDefault()
      e.stopPropagation()
      setOpenDropdown(false)
    }
  }

  const onFocusFilter = () => {
    document.body.addEventListener('click', onClickOutside)
    setOpenDropdown(!openDropdown)
  }

  const clearCalendar = () => {
    setDataFilter([])
    onFilterChange(null)
  }

  const getFilterMessageValue = () => {
    if (dataFilterFilled) {
      const start = dataFilter[0]
      const end = dataFilter[1]
      const startDaySum = start.getDate() + start.getMonth() + start.getFullYear()
      const endDaySum = end.getDate() + end.getMonth() + end.getFullYear()

      return `${start.getDate()} ${monthsAbbreviated[start.getMonth()]} ${start.getFullYear()} ${
        startDaySum !== endDaySum ? `- ${end.getDate()} ${monthsAbbreviated[end.getMonth()]} ${end.getFullYear()}` : ''
      }`
    }

    return label
  }

  return (
    <div className={cx(s['filter-block-wrapper'], s['order-date'], { [s.disabled]: disabled })} ref={filterWrapRef}>
      <div
        className={cx(s['filter-block'], {
          [s['dropdown-open']]: openDropdown,
          [s['with-filter-data']]: dataFilterFilled
        })}
        onClick={onFocusFilter}
      >
        <Icon name='calendar' color='dark-grey' />
        <Text color='dark-grey' size={isMobile ? 'xs' : 'sm'}>
          {getFilterMessageValue()}
        </Text>
      </div>
      {dataFilterFilled && (
        <div className={s['filter-clear']} onClick={clearCalendar}>
          <Icon name='close' color='blue' size='sm' />
        </div>
      )}
      <div style={{ [position]: 0 }} className={cx(s['filter-dropdown'], { [s.active]: openDropdown })}>
        <Text size='md'>Выберите период</Text>
        <Calendar
          classNamesWrapper='offset-top-12'
          onChange={(startDate: Date, endDate: Date) => {
            if (!disabled) onChangeCalendar(startDate, endDate)
          }}
          startDate={dataFilter[0]}
          icon={<Icon name='calendar' color='dark-grey' />}
          selectsRange
          fluid
        />
      </div>
    </div>
  )
}
export default DateFilter
