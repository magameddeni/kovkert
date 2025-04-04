import React, { useState, useRef, ChangeEvent, useEffect, useMemo } from 'react'
import { IFilterSlider } from '@/models'
import { useQueryParams } from '@/hooks'
import { Slider, Text } from '@/components/UI'
import FilterContainer from './FilterContainer'
import s from './filters.module.scss'

interface IPriceRangeFilterProps {
  data: IFilterSlider
}

const PriceRangeFilter = ({ data }: IPriceRangeFilterProps) => {
  const { query, setQuery, deleteQuery } = useQueryParams()

  const possibleMinPrice = useMemo(
    () => +String(query[data.key])?.split(';and')[0] || data.min || 0,
    [query[data.key], data]
  )
  const possibleMaxPrice = useMemo(
    () => +String(query[data.key])?.split(';and')[1] || data.max || 0,
    [query[data.key], data]
  )

  const [price, setPrice] = useState<[number, number]>([possibleMinPrice, possibleMaxPrice])
  const minRef = useRef<HTMLInputElement | null>(null)
  const maxRef = useRef<HTMLInputElement | null>(null)

  const rangeMinMaxLessFifty = (data.max || 0) - (data.min || 0) < 50
  const correctMaxPrice = useMemo(
    () => (rangeMinMaxLessFifty ? (data.max ?? 0) + 50 : data.max),
    [data, rangeMinMaxLessFifty]
  )

  const updateQuery = async () => {
    if (data.min === price[0] && data.max === price[1]) {
      return deleteQuery(data.key)
    }

    return setQuery({ [data.key]: `${price[0]};and${price[1]}` })
  }

  const handleSliderChange = (value: [number, number]) => {
    if (minRef?.current) minRef.current.value = String(value[0])
    if (maxRef?.current) maxRef.current.value = String(value[1])
  }

  const handleMinPrice = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target

    if (!value || !data.min) return

    if (+value < data.min) {
      setPrice([data.min, price[1]])
      e.target.value = String(data.min)
    } else if (+value > price[1]) {
      setPrice([price[1], price[1]])
      e.target.value = String(price[1])
    } else {
      setPrice([parseInt(value), price[1]])
    }
  }

  const handleMaxPrice = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target

    if (!value || !data.max || !data.min) return

    if (+value < price[0]) {
      setPrice([price[0], price[0]])
      e.target.value = String(price[0])
    } else if (+value > data.max) {
      setPrice([price[0], data.max])
      e.target.value = String(data.max)
    } else {
      setPrice([price[0], parseInt(e.target.value)])
    }
  }

  useEffect(() => {
    const filterData: [number, number] = [possibleMinPrice, possibleMaxPrice]
    handleSliderChange(filterData)
    setPrice(filterData)
  }, [possibleMinPrice, possibleMaxPrice])

  useEffect(() => {
    void updateQuery()
  }, [price])

  if (!data.min || !data.max) return null

  return (
    <FilterContainer data={data} active={!!query?.[data.key]} withCollapse={false}>
      <div className={s['price-range-filter']}>
        <div className={s['price-range-filter__input-block']}>
          <label className={s['input-wrapper']}>
            <Text className={s.prefix} color='gray' size='sm' weight='regular'>
              от
            </Text>
            <input
              ref={minRef}
              className={s.input}
              name='minPrice'
              defaultValue={price[0]}
              type='number'
              max={correctMaxPrice}
              onBlur={handleMinPrice}
            />
          </label>
          <label className={s['input-wrapper']}>
            <Text className={s.prefix} color='gray' size='sm' weight='regular'>
              до
            </Text>
            <input
              ref={maxRef}
              className={s.input}
              name='maxPrice'
              defaultValue={rangeMinMaxLessFifty ? price[1] + 50 : price[1]}
              type='number'
              min={data.min}
              max={correctMaxPrice}
              onBlur={handleMaxPrice}
            />
          </label>
        </div>
        <Slider
          className='offset-top-12'
          onChange={handleSliderChange}
          onAfterChange={setPrice}
          min={data.min}
          max={correctMaxPrice}
          defaultValue={[price[0], rangeMinMaxLessFifty ? price[1] + 50 : price[1]]}
          value={[price[0], price[1]]}
        />
      </div>
    </FilterContainer>
  )
}

export default PriceRangeFilter
