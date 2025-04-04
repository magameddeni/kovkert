import React from 'react'
import styles from './star.module.scss'

type StarProps = {
  activeColor: string
  emptyColor: string
  width: number
  height: number
  hover: number
  rating: number | undefined
  setHover: (arg0: number | null) => void
  setRating: (arg0: number) => void
  value: number
  halfStar: boolean
  hoverEvent?: boolean
}

const Star: React.FC<StarProps> = ({
  activeColor,
  emptyColor,
  width,
  height,
  rating,
  setHover,
  setRating,
  hoverEvent = true,
  hover,
  value,
  halfStar
}) => (
  <div
    className={styles.star_icon}
    onClick={() => setRating(value)}
    onMouseEnter={() => hoverEvent ?? setHover(value)}
    onMouseLeave={() => hoverEvent ?? setHover(null)}
  >
    <svg width='0' height='0' viewBox='0 0 32 32'>
      <defs>
        {/* Закрыть часть звезды */}
        <mask id='half'>
          <rect x='0' y='0' width='32' height='32' fill={emptyColor} />
          <rect x='50%' y='0' width='32' height='32' fill={activeColor} />
        </mask>
        {/* Фигура звезды  */}
        <symbol id='star' viewBox='0 0 32 32'>
          <path d='M31.547 12a.848.848 0 00-.677-.577l-9.427-1.376-4.224-8.532a.847.847 0 00-1.516 0l-4.218 8.534-9.427 1.355a.847.847 0 00-.467 1.467l6.823 6.664-1.612 9.375a.847.847 0 001.23.893l8.428-4.434 8.432 4.432a.847.847 0 001.229-.894l-1.615-9.373 6.822-6.665a.845.845 0 00.214-.869z' />
        </symbol>
      </defs>
    </svg>

    <p className={styles.c_icon}>
      <svg className={styles.c_icon} width={width} height={height} viewBox='0 0 32 32'>
        <use
          xlinkHref='#star'
          // @ts-ignore
          fill={value <= (hover || rating) ? activeColor : !halfStar ? emptyColor : activeColor}
          mask={halfStar ? 'url(#half)' : ''}
        />
      </svg>
    </p>
  </div>
)
export default Star
