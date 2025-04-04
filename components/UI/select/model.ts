import { ReactNode } from 'react'

export interface ISelectOption<T = string> {
  value: T
  label: string | ReactNode
  color?: string
  isFixed?: boolean
  isDisabled?: boolean
}
