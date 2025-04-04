import React, { HTMLProps, useEffect } from 'react'
import { Checkbox } from 'components/UI'

const CheckboxCell = ({
  indeterminate,
  className = '',
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) => {
  const ref = React.useRef<HTMLInputElement>(null!)

  useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !rest.checked && indeterminate
    }
  }, [ref, indeterminate])

  return (
    // @ts-ignore
    <Checkbox ref={ref} className={className} {...rest} />
  )
}

export default CheckboxCell
