import React from 'react'
import ReactSlider from 'react-slider'
import cx from 'classnames'

interface ISliderProps {
  className?: string
  defaultValue?: number | number[]
  max: number
  min: number
  value: number[]
  onChange?: (value: number[]) => void
  onAfterChange?: (value: number[]) => void
}

const Slider = React.forwardRef(({ className, ...props }: ISliderProps | any, ref: React.ForwardedRef<unknown>) => {
  if (!props.min && !props.max) return null

  return (
    <ReactSlider
      ref={ref}
      className={cx('horizontalSlider', className)}
      thumbClassName='sliderThumb'
      trackClassName='sliderTrack'
      // ariaLabel={['Lower thumb', 'Upper thumb']}
      ariaValuetext={(state) => `Thumb value ${state.valueNow}`}
      renderThumb={(renderThumbProps, state) => <div {...renderThumbProps}>{state.valueNow}</div>}
      {...props}
    />
  )
})

export default Slider
