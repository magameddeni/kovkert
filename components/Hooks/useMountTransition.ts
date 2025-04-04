import { useEffect, useState } from 'react'

function useMountTransition(isMounted: boolean, delay: number) {
  const [shouldRender, setShoudRender] = useState(false)

  useEffect(() => {
    let timeoutId: any
    if (isMounted && !shouldRender) {
      setShoudRender(true)
    } else if (!isMounted && shouldRender) {
      timeoutId = setTimeout(() => setShoudRender(false), delay)
    }
    return () => clearTimeout(timeoutId)
  }, [isMounted, delay, shouldRender])

  return shouldRender
}

export default useMountTransition
