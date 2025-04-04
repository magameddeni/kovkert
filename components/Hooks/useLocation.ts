import { useState, useEffect } from 'react'

interface Coordinates {
  coordinates: number[]
}

const useLocation = () => {
  const [userLocation, setUserLocation] = useState<Coordinates | undefined>(undefined)

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject)
        })

        const { coords } = position
        setUserLocation({ coordinates: [coords.latitude, coords.longitude] })
      } catch (error) {
        return error
      }
    }

    if (navigator.geolocation) {
      fetchLocation()
    }
  }, [])

  return userLocation
}

export default useLocation
