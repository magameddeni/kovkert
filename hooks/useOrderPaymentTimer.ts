import { useEffect, useRef, useState } from 'react'
import { TOrderStatus } from '@/models'
import { useEvent } from '@/hooks'
import { formatOrderTime } from '@/utils/formatOrderTime'

interface UseOrderPaymentTimer {
  createdOrder: Date | undefined
  status: TOrderStatus | undefined
}

const formatOrderStatus = (status: TOrderStatus | undefined, timeDifference: number) => {
  if (status !== 'Ожидает оплаты') return status
  if (timeDifference > 1800 || timeDifference <= 0) return 'Отменено покупателем'
  return `Ожидает оплаты в течение ${formatOrderTime(timeDifference)}`
}

export const useOrderPaymentTimer = ({ createdOrder, status }: UseOrderPaymentTimer) => {
  const orderDate = new Date(createdOrder ?? '')
  const time = 1800 - Math.floor((Date.now() - orderDate.getTime()) / 1000)
  const [timeDifference, setTimeDifference] = useState<number>(time)

  const intervalRef = useRef<ReturnType<typeof setInterval>>()

  useEvent('focus', () => setTimeDifference(time))

  useEffect(() => {
    if (createdOrder) {
      setTimeDifference(time)
    }
  }, [createdOrder])

  useEffect(() => {
    if (timeDifference < 0) clearInterval(intervalRef.current)
  }, [timeDifference])

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimeDifference((prevDifference) => prevDifference - 1)
    }, 1000)

    return () => clearInterval(intervalRef.current)
  }, [])

  const orderStatus = formatOrderStatus(status, timeDifference)

  return { orderStatus }
}
