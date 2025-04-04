export const reviewsDeclension = (num: number | undefined) => {
  if (!num) return 'отзывов'

  let n = Math.abs(num)

  n %= 100

  if (n >= 5 && n <= 20) {
    return 'отзывов'
  }

  n %= 10

  if (n === 1) {
    return 'отзыв'
  }

  if (n >= 2 && n <= 4) {
    return 'отзыва'
  }

  return 'отзыв'
}
