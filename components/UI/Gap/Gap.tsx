import React from 'react'

export enum GapPosition {
  Vertical = 'vertical',
  Horizontal = 'horizontal'
}

const mapPositionToKey = {
  [GapPosition.Horizontal]: 'width',
  [GapPosition.Vertical]: 'height'
}

interface GapProps {
  size: number
  position?: GapPosition
}

export const Gap: React.FC<GapProps> = ({ size, position = GapPosition.Vertical }) => (
  <div style={{ [mapPositionToKey[position]]: `${size}px` }} />
)
