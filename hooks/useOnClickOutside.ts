import React from 'react'

export const useOnClickOutside = (
  ref: React.Ref<any>,
  onFocusAction: VoidFunction,
  onOutsideAction?: VoidFunction,
  shouldPreventDefault = true
) => {
  // @ts-ignore
  const onClickOutside = (e: MouseEvent) => {
    const element = e.target
    // @ts-ignore
    if (ref.current && !ref.current?.contains(element)) {
      if (shouldPreventDefault) e.preventDefault()
      e.stopPropagation()
      document.body.removeEventListener('click', onClickOutside)
      if (onOutsideAction) onOutsideAction()
    }
  }

  const onFocusElement = () => {
    document.body.addEventListener('click', onClickOutside)
    if (onFocusAction) onFocusAction()
  }

  return { onFocusElement, onClickOutside }
}
