import { useMessage } from '@/hooks'

export const setCoordinates = async (position: any) => {
  const { latitude, longitude } = position.coords
  localStorage.setItem('coords', JSON.stringify({ latitude, longitude }))
}

export const getMyLocation = () => {
  const errorOnGetMyLocation = (err: any) => {
    console.error(`ERROR(${err?.code}): ${err?.message}`)
    // useMessage('Геолокация не поддерживается. Проверьте настройки браузера', 'error')
  }

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(setCoordinates, errorOnGetMyLocation, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    })
  } else {
    useMessage('Геолокация не поддерживается', 'error')
  }
}
