import React from 'react'

interface IPhoneMask {
  showMask?: boolean
  element: HTMLInputElement
  onChange?: ((event: string) => void) | ((event: React.ChangeEvent<HTMLInputElement>) => void) | undefined
}

export const usePhoneMask = ({ showMask = true, element, onChange: onChangeCallback }: IPhoneMask) => {
  const getInputNumbersValueByElement = (inputElement: HTMLInputElement) => inputElement.value.replace(/\D/g, '')
  const setValue = (input: HTMLInputElement, value: string) => setTimeout(() => (input.value = value))
  const setCursor = (input: HTMLInputElement, value: number) => setTimeout(() => (input.selectionEnd = +value))

  const correctFormat = (inputElement: HTMLInputElement, value: string) => {
    let formattedInputValue = ''

    if (value[0] === '9') value = `7${value}`

    formattedInputValue = '+7'

    if (value.length > 1) formattedInputValue += ` ${value.substring(1, 4)}`
    if (value.length >= 5) formattedInputValue += ` ${value.substring(4, 7)}`
    if (value.length >= 8) formattedInputValue += ` ${value.substring(7, 9)}`
    if (value.length >= 10) formattedInputValue += ` ${value.substring(9, 11)}`
    if (inputElement.value.length > 16) formattedInputValue = formattedInputValue.substring(0, 16)

    return formattedInputValue
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputElement = e.target
    const inputNumbersValue = getInputNumbersValueByElement(inputElement)
    const { selectionStart } = inputElement

    if (!inputNumbersValue) {
      // @ts-ignore
      onChangeCallback?.('')
      return (inputElement.value = '')
    }

    if (inputElement.value.length !== selectionStart && selectionStart !== 1) {
      setCursor(inputElement, inputElement.selectionEnd as number)
    }

    // @ts-ignore
    onChangeCallback?.(correctFormat(inputElement, inputNumbersValue))
    inputElement.value = correctFormat(inputElement, inputNumbersValue)
  }

  const onPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const inputElement = e.target
    const inputNumbersValue = getInputNumbersValueByElement(inputElement as HTMLInputElement)
    // @ts-ignore
    const pasted = e.clipboardData || window.clipboardData

    if (pasted) {
      const pastedText = pasted.getData('Text')
      if (/\D/g.test(pastedText)) {
        return ((inputElement as HTMLInputElement).value = inputNumbersValue)
      }
    }
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const inputElement: HTMLInputElement = e.target as any
    const inputValue = inputElement.value.replace(/\D/g, '')

    if (e.keyCode === 8 && inputValue.length === 1) {
      // @ts-ignore
      onChangeCallback?.('')
      inputElement.value = ''
    }

    if (e.keyCode === 8 && (inputElement.selectionStart === 1 || inputElement.selectionStart === 2)) {
      // @ts-ignore
      onChangeCallback?.(inputElement.value)
      setValue(inputElement, inputElement.value)
      setCursor(inputElement, inputElement.selectionStart)
    }
  }

  if (!(showMask && element)) return

  return { onChange, onKeyDown, onPaste, maxLength: '18', placeholder: '+7 000 000 00 00' }
}
