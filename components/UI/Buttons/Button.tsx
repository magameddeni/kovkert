import React from 'react'

import classNames from 'classnames/bind'
import styles from './styles/button.module.scss'

const cn = classNames.bind(styles)

type ButtonProps = {
  loading?: boolean
  size?: 'large' | 'medium' | 'small' // размеры кнопок
  background: 'blue' | 'gray' | 'white' | 'green' | 'transparent' // цвет фона
  color?: 'blue' | 'gray' | 'white' // цвет текста
  handler?: (() => void) | any // вызов функции при нажатии
  text: string // текст кнопки
  icon?: string // иконка рядом с текстом
  disabled?: boolean // отключение кнопки
  round?: string // borderRadius: пример "10px 10px 0px 0px"
  custom_padding?: string | undefined // другое значение паддинг
  font?: 'mini-text-button' | null
  border?: string
  layout?: string
  type?: 'button' | 'submit' | 'reset'
  fluid?: boolean | undefined
}

const Button: React.FC<ButtonProps> = ({
  loading,
  disabled,
  size,
  handler,
  background,
  color,
  text,
  icon,
  custom_padding,
  round,
  font,
  border,
  layout,
  type,
  fluid
}) => (
  <button
    style={{
      padding: custom_padding,
      borderRadius: round,
      borderWidth: border
    }}
    className={cn({
      button: true,
      button__fill: layout === 'fill',
      large: size === 'large',
      medium: size === 'medium',
      small: size === 'small',
      blue: background === 'blue',
      gray: background === 'gray',
      white: background === 'white',
      transparent: background === 'transparent',
      green: background === 'green',
      color_blue: color === 'blue',
      color_gray: color === 'gray',
      color_white: color === 'white',
      font_style: font === 'mini-text-button',
      fluid
    })}
    onClick={handler}
    disabled={disabled}
    type={type}
  >
    {loading && (
      <div className={styles.loader}>
        <div className={styles.loader__icon} />
      </div>
    )}
    {text && text}
    {icon && <img className={styles.button__icon} src='' alt='' />}
  </button>
)

export default Button
