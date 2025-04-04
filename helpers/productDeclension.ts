export const productDeclension = (num: number) => {
  if (!num) return 'товаров'

  let n = Math.abs(num)

  n %= 100

  if (n >= 5 && n <= 20) {
    return 'товаров'
  }

  n %= 10

  if (n === 1) {
    return 'товар'
  }

  if (n >= 2 && n <= 4) {
    return 'товара'
  }

  return 'товаров'
}
