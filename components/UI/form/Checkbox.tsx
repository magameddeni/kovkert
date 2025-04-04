import React from 'react'
import cx from 'classnames'
import FormLabel from './FormLabel'
// import FormError from './FormError'
import s from './style.module.scss'

interface ICheckboxProps {
  id?: string
  name: string
  className?: string
  classNameInputWrapper?: string
  style?: React.CSSProperties
  type?: 'checkbox' | 'radio'
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  defaultValue?: string | boolean | object
  value?: any
  label?: string
  disabled?: boolean
  required?: boolean
  register?: any
  rules?: any
  errors?: any
  checked?: boolean
  view?: 'filter'
}

const Checkbox = ({
  id,
  name,
  className,
  classNameInputWrapper,
  style,
  type = 'checkbox',
  onChange,
  value,
  label,
  disabled,
  required,
  register,
  rules,
  errors,
  checked = false,
  view,
  ...rest
}: ICheckboxProps) => {
  const validation = register ? { ...register(name, rules) } : null
  const isRequired = required || rules?.required?.value

  const formInputWrapperClassList = cx(
    s['form-input-wrapper'],
    s[type],
    {
      [s.error]: errors?.[name],
      [s[`view-${view}`]]: view
    },
    classNameInputWrapper
  )

  const inputClassList = cx(s.input, className)

  return (
    <label htmlFor={id} className={formInputWrapperClassList}>
      <div className={s['input-container']}>
        <input
          id={id}
          name={name}
          className={inputClassList}
          style={style}
          type={type}
          onChange={onChange}
          checked={checked}
          value={value}
          disabled={disabled}
          {...validation}
          {...rest}
        />
        <span className={s.checkmark} />
        <FormLabel label={label} required={isRequired} />
      </div>
      {/* <FormError message={errors?.[name]?.message} /> */}
    </label>
  )
}

export default Checkbox
