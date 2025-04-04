import React, { useState } from 'react'
import Star from './Star'
import styles from './star.module.scss'

type StarRatingProps = {
  maxStars: number
  emptyColor: string
  activeColor: string
  width: number
  height: number
  defaultState: number | undefined
  onChangeHover?: (arg0: number) => void
  onChangeValue?: (arg0: number) => void
  readOnly: boolean
  hoverEvent?: boolean
}

const StarRating: React.FC<StarRatingProps> = ({
  maxStars,
  emptyColor,
  activeColor,
  width,
  height,
  defaultState,
  onChangeHover,
  onChangeValue,
  hoverEvent = false,
  readOnly
}) => {
  const [rating, setRating] = useState<number | undefined>(defaultState)
  const [hover, setHover] = useState(Number)

  const setRatingFn = (value: any) => {
    if (!readOnly) {
      setRating(value)
      onChangeValue?.(value)
    }
  }

  const setHoverFn = (value: any) => {
    if (!readOnly) {
      setHover(value)
      onChangeHover?.(value)
    }
  }

  return (
    <>
      <div className={styles.svg_container}>
        {[...Array(maxStars)].map((_, i: number) => {
          const value = i + 1
          let isRemainder = false
          if (value === Math.ceil(rating as any) && rating) {
            isRemainder = rating % 1 !== 0
          }
          return (
            <Star
              key={Math.random()}
              halfStar={isRemainder}
              value={value}
              hover={hover}
              emptyColor={emptyColor}
              activeColor={activeColor}
              width={width}
              height={height}
              rating={rating}
              setHover={setHoverFn}
              setRating={setRatingFn}
              hoverEvent={hoverEvent}
            />
          )
        })}
      </div>
    </>
  )
}

export default StarRating
