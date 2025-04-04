import { useState, useLayoutEffect, useMemo } from 'react'
import { mediaBreakpoints as sizes } from '../constants/grid'
import { useEvent } from './useEvent'

interface IUseWindowSize {
  width: IWindowSize
  height: IWindowSize
  size: ISize
  deviceWidth: IDeviceWidth
  isSmall: boolean
  isMedium: boolean
  isLarge: boolean
}

type ISize = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | ''
export type IDeviceWidth = 'small' | 'medium' | 'large' | ''
type IWindowSize = number | null

export const useWindowSize = (): IUseWindowSize => {
  const [size, setSize] = useState<ISize>('')
  const [deviceWidth, setDeviceWidth] = useState<IDeviceWidth>('')
  const [windowSize, setWindowSize] = useState<{ width: IWindowSize; height: IWindowSize }>({
    width: null,
    height: null
  })

  const isSmall = useMemo(() => deviceWidth === 'small', [deviceWidth])
  const isMedium = useMemo(() => deviceWidth === 'medium', [deviceWidth])
  const isLarge = useMemo(() => deviceWidth === 'large', [deviceWidth])

  const getCurrentDeviceWidth = (currentSize: ISize) => {
    if (currentSize === 'xxs' || currentSize === 'xs') return 'small'
    if (currentSize === 'sm' || currentSize === 'md') return 'medium'
    if (currentSize === 'lg' || currentSize === 'xl' || currentSize === 'xxl') return 'large'
  }

  const getCurrentSize = (width: number) => {
    if (sizes.xs <= width && width < sizes.sm) return 'xs'
    if (sizes.sm <= width && width < sizes.md) return 'sm'
    if (sizes.md <= width && width < sizes.lg) return 'md'
    if (sizes.lg <= width && width < sizes.xl) return 'lg'
    if (sizes.xl <= width && width < sizes.xxl) return 'xl'
    if (width >= sizes.xxl) return 'xxl'
    return 'xxs'
  }

  const handleResize = () => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight })

    const currentSize = getCurrentSize(window.innerWidth)
    setSize(currentSize)

    const currentDeviceWidth = getCurrentDeviceWidth(currentSize)
    setDeviceWidth(currentDeviceWidth as IDeviceWidth)
  }

  useLayoutEffect(() => handleResize(), [])
  useEvent('resize', handleResize)

  return { ...windowSize, size, deviceWidth, isSmall, isMedium, isLarge }
}
