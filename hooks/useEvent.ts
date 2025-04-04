import { useEffect } from 'react'

export const useEvent = (event: any, handler: VoidFunction, passive: boolean = false) => {
  const hasWindow = typeof window !== 'undefined'

  useEffect(() => {
    if (hasWindow) {
      window.addEventListener(event, handler, passive)
      return () => window.removeEventListener(event, handler)
    }
  }, [hasWindow])
}
