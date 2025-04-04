export const yearDeclension = (num: number) => {
  if (!num) return 'лет'

  let n = Math.abs(num)

  n %= 100

  if (n >= 5 && n <= 20) {
    return 'лет'
  }

  n %= 10

  if (n === 1) {
    return 'год'
  }

  if (n >= 2 && n <= 4) {
    return 'года'
  }

  return 'год'
}
