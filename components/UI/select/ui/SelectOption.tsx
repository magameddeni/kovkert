import React from 'react'
import { components, OptionProps } from 'react-select'
import { Icon, ISelectOption } from '@/components/UI'

export const SelectOption = ({ ...props }: OptionProps<ISelectOption>) => (
  <components.Option {...props}>
    {props.data.label}
    {props.isSelected && <Icon name='check' size='sm' />}
  </components.Option>
)
