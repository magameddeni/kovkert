import { useCallback } from 'react'
import { useEvent } from '@/hooks/useEvent'

export const useCloseOnEsc = (onClose: VoidFunction) => {
  const closeOnEscKey = useCallback(
    (e?: KeyboardEvent) => {
      if (e?.charCode || e?.keyCode === 27) onClose()
    },
    [onClose]
  )

  useEvent('keydown', closeOnEscKey)
}
