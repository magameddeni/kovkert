import React from 'react'
import cx from 'classnames'
import { Button, Icon } from '@/components/UI'
import s from './style.module.scss'

interface IPaginationProps {
  classNameWrapper?: string
  totalCount: number | undefined
  onPage: number
  pageIndex: number | undefined
  onChange?: (value: number) => void
  onChangeShowMore: (value: number) => void
  disabled?: boolean
  hasPaginationButtons?: boolean
}

const Pagination = ({
  classNameWrapper,
  totalCount,
  onPage,
  pageIndex = 1,
  onChange,
  onChangeShowMore,
  disabled = false,
  hasPaginationButtons = true
}: IPaginationProps) => {
  const pagesCount = Math.ceil(Number(totalCount) / onPage)

  const getVisiblePages = (page: number) => {
    if (page % 5 >= 0 && page > 3 && pagesCount > 6) {
      if (page + 2 < pagesCount) {
        return [1, page - 2, page - 1, page, page + 1, page + 2, pagesCount]
      }

      if (page + 2 >= pagesCount) {
        return [1, pagesCount - 5, pagesCount - 4, pagesCount - 3, pagesCount - 2, pagesCount - 1, pagesCount]
      }
    }

    return [
      ...new Array(pagesCount)
        .fill('')
        .map((_, i: number) => i + 1)
        .slice(0, Math.min(pagesCount - 1, 6)),
      pagesCount
    ]
  }

  if (!totalCount || totalCount <= onPage) return null

  return (
    <div className={cx(s.pagination, classNameWrapper)}>
      <Button
        view='secondary'
        onClick={() => onChangeShowMore(pageIndex + 1)}
        disabled={pageIndex === pagesCount}
        fluid
      >
        Показать еще
      </Button>
      {hasPaginationButtons && typeof onChange === 'function' && (
        <div className={s.pagination__buttons}>
          <Icon
            name='arrow-left'
            className={cx(s.button, s.arrow, { [s.disabled]: pageIndex <= 1 || disabled })}
            disable={disabled || pageIndex <= 1}
            onClick={() => (onChange ? onChange(pageIndex - 1) : {})}
          />
          <div className={s['choice-page']}>
            {getVisiblePages(pageIndex as number).map((v: number) => (
              <span
                key={v}
                className={cx(s.button, { [s.active]: v === pageIndex })}
                onClick={() => (onChange ? onChange(v) : {})}
              >
                {v}
              </span>
            ))}
          </div>
          <Icon
            name='arrow-right'
            className={cx(s.button, s.arrow, { [s.disabled]: pageIndex >= pagesCount || disabled })}
            disable={disabled || pageIndex >= pagesCount}
            onClick={() => (onChange ? onChange(pageIndex + 1) : {})}
          />
        </div>
      )}
    </div>
  )
}

export default React.memo(Pagination)
