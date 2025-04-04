import React, { ChangeEvent } from 'react'
import classNames from 'classnames/bind'
import styles from './styles/input.module.scss'

const cn = classNames.bind(styles)

type InputProps = {
  disabled?: boolean
  value: string
  name: string
  placeholder: string
  handleChange: (event: string, name: string, target: EventTarget) => void
  required: boolean
  setFocus?: (value: boolean) => void
}

const Input: React.FC<InputProps> = ({
  placeholder,
  value = '',
  handleChange,
  name,
  required,
  disabled = false,
  setFocus
}) => {
  const [stateBlur, setStateBlur] = React.useState<boolean>(false)
  const input = React.useRef(null)

  const inputChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    handleChange(event.target.value, event.target.id, event.target)

    const span = document.createElement('prev')
    span.style.visibility = 'hidden'
    span.style.whiteSpace = ' pre-wrap'
    span.innerHTML = event.target.value
    document.body.appendChild(span)
    document.body.removeChild(span)
  }

  const onBlur = () => {
    setStateBlur(false)
    if (setFocus) setFocus(false)
  }

  const onFocus = () => {
    setStateBlur(true)
    if (setFocus) setFocus(true)
  }

  return (
    <div className={styles.input_block} ref={input}>
      <label
        htmlFor={name}
        className={cn({
          input_block__label: true,
          'input_block__label-active': stateBlur || value.length > 0
        })}
      >
        {placeholder}
      </label>
      <input
        onFocus={onFocus}
        onBlur={onBlur}
        disabled={disabled}
        required={required}
        id={name}
        value={value || ''}
        onChange={inputChangeHandler}
        className={cn({
          input_block__input: true,
          'input_block__input-active': stateBlur || value.length > 0
        })}
      />
    </div>
  )
}

export default Input
