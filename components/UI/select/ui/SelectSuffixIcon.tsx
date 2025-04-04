import React from 'react'
import { components, DropdownIndicatorProps } from 'react-select'
import { Icon } from '@/components/UI'

interface ISelectSuffixIconProps extends DropdownIndicatorProps {
  suffixIcon?: string | undefined
}

export const SelectSuffixIcon = ({ suffixIcon, ...props }: ISelectSuffixIconProps) => (
  <components.DropdownIndicator {...props}>
    {suffixIcon && <Icon name={suffixIcon} size='sm' color='gray' />}
  </components.DropdownIndicator>
)
