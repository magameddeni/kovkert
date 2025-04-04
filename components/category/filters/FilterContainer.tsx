import React, { PropsWithChildren, useState } from 'react'
import cx from 'classnames'
import { IFilter, IFilterSlider } from '@/models'
import { Button, Icon, Text } from '@/components/UI'
import s from './filters.module.scss'

interface IFilterContainerProps extends PropsWithChildren {
  data: IFilter | IFilterSlider
  active?: boolean
  withCollapse?: boolean
}

const FilterContainer = ({ children, data, active = false, withCollapse = true }: IFilterContainerProps) => {
  const [isShowMore, setIsShowMore] = useState<boolean>(false)
  const [isCollapse, setIsCollapse] = useState<boolean>(false)

  const getChildren = () => {
    if (isShowMore || !withCollapse) return children

    return {
      // @ts-ignore
      ...children,
      props: {
        // @ts-ignore
        ...children.props,
        // @ts-ignore
        children: children.props?.children
      }
    }
  }

  if (!data) return null

  return (
    <div
      className={cx(s.filter, {
        [s.open]: isShowMore,
        [s.collapse]: isCollapse
      })}
    >
      <div className={s.filter__header} onClick={() => setIsCollapse(!isCollapse)}>
        <div className={s.title}>
          <Text as='p' size='lg' family='secondary' overflow='ellipsis'>
            {data.title}
            {data.key === 'price_range' && ', ₽'}
          </Text>
          {active && <div className={s['active-filter']} />}
        </div>
        <Icon name='arrow-top' size='md' color='gray' />
      </div>
      <div className={s.filter__content}>{getChildren()}</div>
      {withCollapse && 'values' in data && data.values.length > 5 && (
        <Button
          className={s['filter__show-more-button']}
          onClick={() => setIsShowMore(!isShowMore)}
          iconRight={!isShowMore ? 'arrow-bottom' : 'arrow-top'}
          iconOptions={{ size: 'xs', color: 'blue' }}
          view='link'
        >
          {!isShowMore ? 'Показать еще' : 'Скрыть'}
        </Button>
      )}
    </div>
  )
}

export default FilterContainer
