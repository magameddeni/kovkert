import React, { useRef, useState, useEffect } from 'react'
import cx from 'classnames'
import { UseFormRegister } from 'react-hook-form'
import { Suffix } from './Suffix'
import FormLabel from './FormLabel'
import FormError from './FormError'
import s from './style.module.scss'

interface IInputProps {
  name: string
  id?: string
  className?: string
  classNameInputWrapper?: string
  style?: React.CSSProperties
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void
  onKeyUp?: (event: React.KeyboardEvent<HTMLInputElement>) => void
  defaultValue?: string | boolean | object
  value?: any
  label?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  register?: UseFormRegister<any>
  rules?: any
  errors?: any
  suffix?: string
  fluid?: boolean
  textCenter?: boolean
  showLabelRequired?: boolean
  rows?: number
  view?: string
  autoHeight?: boolean
  isResetHeight?: boolean
}

const Textarea = ({
  id,
  name,
  className,
  classNameInputWrapper,
  style,
  onChange,
  defaultValue,
  value,
  label,
  placeholder,
  disabled,
  required,
  register,
  rules,
  errors,
  suffix,
  fluid,
  textCenter,
  rows,
  view,
  autoHeight,
  isResetHeight,
  onKeyDown,
  onKeyUp,
  ...rest
}: IInputProps) => {
  const inputRef = useRef<HTMLDivElement | null>(null)
  const [validation, setValidation] = useState<any>(null)
  const [isRequired, setIsRequired] = useState<boolean>(false)

  const formInputWrapperClassList = cx(
    s['form-input-wrapper'],
    {
      [s.error]: errors?.[name] || errors?.ref?.name === name,
      [s.fluid]: fluid,
      [s[`view-${view}`]]: view
    },
    classNameInputWrapper
  )

  const inputClassList = cx(
    s.input,
    s.textarea,
    {
      [s['has-suffix']]: suffix,
      [s['text-center']]: textCenter,
      fluid,
      [s.error]: errors?.[name] || errors?.ref?.name === name
    },
    className
  )

  useEffect(() => {
    setValidation(
      register ? { ...register(name, { ...rules, onChange: (e: any) => (onChange ? onChange(e) : null) }) } : null
    )
    setIsRequired(required || rules?.required?.value)
  }, [])

  useEffect(() => {
    if (autoHeight) {
      // @ts-ignore
      inputRef.current.lastElementChild.style.height = 'auto'

      if (value && inputRef?.current?.lastElementChild) {
        // @ts-ignore
        inputRef.current.lastElementChild.style.height = `${Math.min(
          inputRef.current.lastElementChild.scrollHeight,
          350
        )}px`
      }
    }
  }, [value, autoHeight])

  useEffect(() => {
    if (!value && isResetHeight && inputRef?.current?.lastElementChild) {
      // @ts-ignore
      inputRef.current.lastElementChild.style.height = `${Math.min(
        inputRef.current.lastElementChild.scrollHeight,
        40
      )}px`
    }
  }, [value, isResetHeight])

  return (
    <label className={formInputWrapperClassList}>
      <div className={s['input-container']} ref={inputRef}>
        <FormLabel label={label} required={isRequired} />
        <textarea
          id={id}
          name={name}
          className={inputClassList}
          style={style}
          onChange={onChange}
          defaultValue={defaultValue}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          {...validation}
          {...rest}
        />
        {suffix && <Suffix suffix={suffix}>{/* {tooltip && <Tooltip tooltipText={tooltip} />} */}</Suffix>}
      </div>
      <FormError message={errors?.[name]?.message || (errors?.ref?.name === name && errors?.message)} />
    </label>
  )
}

export default Textarea
