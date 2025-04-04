import React from 'react'
import cx from 'classnames'
import s from './style.module.scss'

interface IDotsLoaderProps {
  center?: boolean
  centerContainer?: boolean
  size?: 'sm' | 'md'
}

const DotsLoader = ({ center, centerContainer, size }: IDotsLoaderProps) => (
  <div
    className={cx(s['dots-loader'], {
      [s.center]: center,
      [s['center-container']]: centerContainer,
      [s[`size-${size}`]]: size
    })}
  >
    <div />
    <div />
    <div />
  </div>
)

export default DotsLoader
