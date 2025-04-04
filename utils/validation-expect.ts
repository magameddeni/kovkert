const getStringLength = (value: string | null | undefined) =>
  String(value || '')
    .replace(/_+/g, '')
    .replace(/\s+/g, '').length

export const stringLength = (expectedLength: number) => (value: string | null | undefined) => {
  const length = getStringLength(String(value || ''))

  return length === expectedLength
}

export const stringLengthBetween = (minLength: number, maxLength: number) => (value: string | null | undefined) => {
  const length = getStringLength(value)

  return length >= minLength && length <= maxLength
}

export const phoneNumber = (value: string | null | undefined) => stringLength(11)(String(value).replace(/\D/giu, ''))
