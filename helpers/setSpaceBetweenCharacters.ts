export const setSpaceBetweenCharacters = (word: string | number | undefined, space: number = 3) => {
  if (!word || !space) return word

  const reg = new RegExp(`\\B(?=(\\d{${space}})+(?!\\d))`, 'g')

  return String(word).replace(reg, ' ')
}
