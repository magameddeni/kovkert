import React, { PropsWithChildren } from 'react'

interface IfProps extends PropsWithChildren {
  condition: boolean
}

const If: React.FC<IfProps> = ({ children, condition }) => {
  if (!condition) return null
  return children
}

export default If
