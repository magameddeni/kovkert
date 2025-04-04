import { IUserState } from '@/redux/user/userSlice'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

declare const window: Window & {
  webkit?: any
  addEventListener?: any
  removeEventListener?: any
}

interface PushNotificationEventDetail {
  [key: string]: any
}

const usePushControl = ({ user, mutate }: { user: IUserState; mutate: (data: any) => void }) => {
  const [firebaseToken, setFirebaseToken] = useState<string>('')
  const [iOSPushCapability, setIOSPushCapability] = useState<boolean>(false)
  const router = useRouter()

  const logMessage = (message: string): void => {
    setFirebaseToken(message)
  }

  const pushTokenRequest = (): void => {
    window.webkit.messageHandlers['push-token'].postMessage('push-token')
  }

  useEffect(() => {
    if (
      window.webkit &&
      window.webkit.messageHandlers &&
      window.webkit.messageHandlers['push-permission-request'] &&
      window.webkit.messageHandlers['push-permission-state']
    ) {
      setIOSPushCapability(true)
      pushTokenRequest()
    }

    const handlePushPermissionRequest = (event: CustomEvent<string>): void => {
      if (event && event.detail) {
        switch (event.detail) {
          case 'granted':
            // permission granted
            break
          default:
            toast.info('пожалуйста, включите уведомление в приложении')
            break
        }
      }
    }

    const handlePushPermissionState = (event: CustomEvent<string>): void => {
      if (event && event.detail) {
        switch (event.detail) {
          case 'notDetermined':
            // permission not asked
            break
          case 'denied':
            // permission denied
            break
          case 'authorized':
          case 'ephemeral':
          case 'provisional':
            // permission granted
            break
          case 'unknown':
          default:
            // something wrong
            break
        }
      }
    }

    const handlePushNotification = (event: CustomEvent<PushNotificationEventDetail>): void => {
      if (event && event.detail) {
        const url = event.detail?.click_action
        router.push(url || '/')
      }
    }

    const handlePushToken = (event: CustomEvent<PushNotificationEventDetail>): void => {
      if (event && event.detail) {
        logMessage(event.detail as unknown as string)
      }
    }

    window.addEventListener('push-permission-request', handlePushPermissionRequest)
    window.addEventListener('push-permission-state', handlePushPermissionState)
    window.addEventListener('push-notification', handlePushNotification)
    window.addEventListener('push-token', handlePushToken)

    return () => {
      window.removeEventListener('push-permission-request', handlePushPermissionRequest)
      window.removeEventListener('push-permission-state', handlePushPermissionState)
      window.removeEventListener('push-notification', handlePushNotification)
      window.removeEventListener('push-token', handlePushToken)
    }
  }, [])

  const pushPermissionRequest = (): void => {
    if (iOSPushCapability) {
      window.webkit.messageHandlers['push-permission-request'].postMessage('push-permission-request')
    }
  }

  const pushPermissionState = (): void => {
    if (iOSPushCapability) {
      window.webkit.messageHandlers['push-permission-state'].postMessage('push-permission-state')
    }
  }

  const pushSubscribeTopic = (topic: string, eventValue: any, unsubscribe: boolean = false): void => {
    if (iOSPushCapability) {
      window.webkit.messageHandlers['push-subscribe'].postMessage(
        JSON.stringify({
          topic,
          eventValue,
          unsubscribe
        })
      )
    }
  }

  useEffect(() => {
    if (firebaseToken && user?.data?.firebaseToken !== firebaseToken) {
      mutate({ firebaseToken })
    }
  }, [firebaseToken])

  return {
    firebaseToken,
    iOSPushCapability,
    pushTokenRequest,
    pushSubscribeTopic,
    pushPermissionState,
    pushPermissionRequest,
    setIOSPushCapability
  }
}

export default usePushControl
