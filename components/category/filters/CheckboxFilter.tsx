import React from 'react'
import { useRouter } from 'next/router'
import { IFilter } from '@/models'
import { useQueryParams } from '@/hooks'
import { Checkbox } from '@/components/UI'
import FilterContainer from './FilterContainer'
import s from './filters.module.scss'

interface ICheckboxFilterProps {
  data: IFilter
}

const CheckboxFilter = ({ data }: ICheckboxFilterProps) => {
  const { setQuery, deleteQuery } = useQueryParams()
  const router = useRouter()

  const setCheckboxValueInQuery = async (name: string, checked: boolean) => {
    const queryValueByKey: string | string[] | undefined = router.query?.[data.key]
    const stringQueryValueByKey: string | undefined = queryValueByKey ? String(queryValueByKey) : queryValueByKey

    if (!checked && stringQueryValueByKey) {
      const currentQueryValue = stringQueryValueByKey
        .split(';and')
        .filter((v: string) => v !== name)
        .join(';and')

      if (currentQueryValue) {
        return setQuery({ [data.key]: currentQueryValue })
      }

      return deleteQuery(data.key)
    }

    return setQuery({ [data.key]: stringQueryValueByKey ? `${stringQueryValueByKey};and${name}` : name })
  }

  return (
    <FilterContainer data={data} active={!!router.query?.[data.key]}>
      <div className={s['checkbox-filter']}>
        {data?.values?.map((v: string) => (
          <Checkbox
            key={v}
            name={v}
            value={v}
            type='checkbox'
            label={v}
            checked={router.query?.[data.key] ? String(router.query[data.key]).split(';and').includes(v) : false}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setCheckboxValueInQuery(e.target.name, e.target.checked)
            }
            view='filter'
          />
        ))}
      </div>
    </FilterContainer>
  )
}

export default CheckboxFilter
