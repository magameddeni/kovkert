import React, { useState, ForwardedRef, useEffect } from 'react'
import BaseSelect, { DropdownIndicatorProps } from 'react-select'
import cx from 'classnames'
import { ISelectOption } from '@/components/UI'
import FormError from '../form/FormError'
import FormLabel from '../form/FormLabel'
import { SelectOption, SelectSuffixIcon } from './ui'
import s from '../form/style.module.scss'

interface ISelect {
  id?: string
  name: string
  className?: string
  style?: React.CSSProperties
  value: ISelectOption | undefined
  defaultValue?: ISelectOption
  label?: string
  required?: boolean
  onChange?: (data: ISelectOption<unknown | any>) => void
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
  rules?: any
  errors?: any
  fluid?: boolean
  suffixIcon?: string
  classNameInputWrapper?: string
  view?: 'primary' | 'secondary' | 'light'
  open?: boolean
  placeholder?: string
  disabled?: boolean
  isClearable?: boolean
  isSearchable?: boolean
  isLoading?: boolean
  options?: Array<ISelectOption>
  styleControl?: React.CSSProperties
}

const Select = React.forwardRef(
  (
    {
      name,
      className,
      label,
      required,
      rules,
      errors,
      fluid,
      suffixIcon,
      classNameInputWrapper,
      view = 'primary',
      open,
      disabled = false,
      placeholder = 'Выбрать',
      isClearable = false,
      isSearchable = false,
      isLoading = false,
      styleControl,
      ...rest
    }: ISelect,
    ref: ForwardedRef<any>
  ) => {
    const [isRequired, setIsRequired] = useState(false)
    const isSecondaryView = view === 'secondary'

    const formInputWrapperClassList = cx(
      s['form-input-wrapper'],
      {
        [s.error]: errors?.[name],
        [s.fluid]: fluid,
        [s[`view-${view}`]]: view,
        [`view-${view}`]: view
      },
      classNameInputWrapper
    )

    const selectClassList = cx(
      'select',
      {
        error: errors?.[name],
        'with-suffix-icon': suffixIcon,
        fluid,
        disabled
      },
      className
    )

    useEffect(() => {
      setIsRequired(required || rules?.required?.value)
    }, [])

    const SelectSuffixIconWrapper = (props: DropdownIndicatorProps) => (
      <SelectSuffixIcon suffixIcon={suffixIcon} {...props} />
    )

    return (
      <label className={formInputWrapperClassList}>
        <FormLabel label={isSecondaryView && errors?.[name] ? errors?.[name]?.message : label} required={isRequired} />
        <div className={s['input-container']} ref={ref}>
          <BaseSelect
            ref={ref}
            name={name}
            className={selectClassList}
            classNamePrefix='select'
            isDisabled={disabled}
            isLoading={isLoading}
            isClearable={isClearable as boolean}
            placeholder={placeholder}
            isSearchable={isSearchable}
            menuIsOpen={open}
            styles={{
              control: (baseStyles) => ({
                ...baseStyles,
                ...styleControl
              })
            }}
            noOptionsMessage={() => 'Не найдено'}
            // @ts-ignore
            components={{ DropdownIndicator: SelectSuffixIconWrapper, Option: SelectOption }}
            {...rest}
          />
        </div>
        {!isSecondaryView && <FormError message={errors?.[name]?.message} />}
      </label>
    )
  }
)

export default Select
