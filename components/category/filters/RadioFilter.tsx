import React from 'react'
import { useRouter } from 'next/router'
import { IFilter } from '@/models'
import { useQueryParams } from '@/hooks'
import { Checkbox } from '@/components/UI'
import FilterContainer from './FilterContainer'
import s from './filters.module.scss'

interface IRadioFilterProps {
  data: IFilter
}

const RadioFilter = ({ data }: IRadioFilterProps) => {
  const { setQuery } = useQueryParams()
  const router = useRouter()

  return (
    <FilterContainer data={data} active={!!router.query?.[data.key]}>
      <div className={s['checkbox-filter']}>
        {data?.values?.map((v: string) => (
          <Checkbox
            key={v}
            name={data.key}
            value={v}
            type='radio'
            label={v}
            checked={router.query?.[data.key]?.includes(v)}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery({ [e.target.name]: e.target.value })}
            view='filter'
          />
        ))}
      </div>
    </FilterContainer>
  )
}

export default RadioFilter
