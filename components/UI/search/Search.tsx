import React, { useEffect, useRef, useState } from 'react'
import cx from 'classnames'
import { Icon, Input, Text } from 'components/UI/index'
import { useOnClickOutside, useDebounce } from 'hooks'
import s from './style.module.scss'

interface IOrderSearchProps {
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

export const Search = ({ onChange, placeholder = 'Поиск', disabled }: IOrderSearchProps) => {
  const [openDropdown, setOpenDropdown] = useState<boolean>(false)
  const [value, setValue] = React.useState<string>('')
  const filterWrapRef = useRef(null)
  const searchInputRef = useRef(null)
  const debouncedValue = useDebounce<string>(value, 300)

  const onOutsideAction = () => {
    // @ts-ignore
    if (!searchInputRef?.current?.firstChild?.value) setOpenDropdown(false)
  }

  const { onFocusElement } = useOnClickOutside(
    filterWrapRef,
    () => setOpenDropdown(true),
    () => onOutsideAction()
  )

  const onClearInput = () => {
    setOpenDropdown(false)
    setValue('')
  }

  useEffect(() => {
    onChange(debouncedValue.trim() || '')
  }, [debouncedValue])

  return (
    <div
      ref={filterWrapRef}
      className={cx(s.search, { [s.disabled]: disabled })}
      onClick={(e) => {
        e.stopPropagation()
        onFocusElement()
      }}
    >
      {!openDropdown ? (
        <div className={s['filter-block']}>
          <Icon name='search-light' color='gray-dark' />
          <Text color='dark-gray' size='sm'>
            Поиск
          </Text>
        </div>
      ) : (
        <Input
          ref={searchInputRef}
          name='search'
          type='search'
          view='search'
          placeholder={placeholder as string}
          value={value}
          classNameInputWrapper={s['search-input-wrapper']}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => !disabled && setValue(e.target.value)}
          onClear={onClearInput}
          autoFocus
        />
      )}
    </div>
  )
}
