import React from 'react'

interface DividerProps {
  orientation: 'vertical' | 'horizontal'
  height?: number
  width?: number
}

const Divider: React.FC<DividerProps> = ({ orientation, height = 1, width = 1 }) => {
  const style = {
    backgroundColor: 'rgb(240, 241, 243)',
    ...(orientation === 'horizontal'
      ? { height: `${height}px`, width: '100%' }
      : { height: '100%', width: `${width}px` })
  }

  return <div style={style} />
}

export default Divider
