import { urlB64ToUint8Array } from '@/utils/urlB64ToUint8Array'
import { useMutation } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useAppSelector } from '@/redux/hook'
import { useLazyGetUserQuery } from '@/redux/user/userApi'
import $api from '../components/Http/axios'
import usePushControl from './usePushControl'

const usePushNotification = () => {
  const user = useAppSelector(({ beru }) => beru.user)
  const [getUserInfo] = useLazyGetUserQuery()
  const { mutate } = useMutation({
    mutationFn: async (data: any) => {
      const { data: responseData, status } = await $api.patch('/api/v1.0/users/updateUser', data)
      if (status === 200) return responseData
    },
    onSuccess: () => getUserInfo({ initial: false })
  })

  usePushControl({ user, mutate })

  useEffect(() => {
    if ('serviceWorker' in navigator && user?.isLoggedIn) {
      navigator.serviceWorker
        .register('/sw.js')
        .then(() => Notification.requestPermission())
        .then((permission) => {
          if (permission === 'granted') {
            return navigator.serviceWorker.ready.then((registration) => {
              const subscriptionOptions = {
                userVisibleOnly: true,
                applicationServerKey: urlB64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_KEY || '')
              }
              return registration.pushManager.subscribe(subscriptionOptions)
            })
          }
        })
        .then((notificationData) => {
          if (notificationData && JSON.stringify(user?.data?.notificationData) !== JSON.stringify(notificationData)) {
            mutate({ notificationData })
          }
        })
        .catch((err) => console.error('Failed to subscribe', err))
    }
  }, [])
}
export default usePushNotification
