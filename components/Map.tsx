import React from 'react'
import { Map, Placemark, useYMaps } from '@pbe/react-yandex-maps'
import { TUserAddress } from '@/models'
import { DotsLoader } from '@/components/UI'
import PvzPinIcon from '@/public/pin.png'

interface MapPropsType {
  coordinates: number[]
  width?: string | number | undefined
  height?: string | number | undefined
  handleMarkClick?: (value: any) => void
  markerDisabled?: boolean
  disabled?: boolean
  onMapClick?: (data: TUserAddress) => void
}

const Maps = ({ coordinates, width, height, handleMarkClick, markerDisabled, disabled, onMapClick }: MapPropsType) => {
  const ymaps = useYMaps(['Map', 'geocode'])

  const onMapClickHandler = async (event: any) => {
    const coords = event.get('coords')
    const geocode = ymaps && (await ymaps.geocode(coords, { kind: 'house' }))

    const locationObject: any = geocode?.geoObjects?.get(0)

    onMapClick?.({
      coordinates: coords,
      fullname: locationObject?.getAddressLine() ?? '',
      // country: locationObject?.getCountry(),
      city: locationObject?.getLocalities()[0],
      street: locationObject?.getThoroughfare(),
      building: locationObject?.getPremiseNumber()
    })
  }

  if (!ymaps) return <DotsLoader centerContainer />

  return (
    <Map
      modules={['geocode']}
      width={width}
      height={height}
      state={{
        center: coordinates?.length ? coordinates : [43.318471, 45.680886],
        zoom: 11
      }}
      onClick={disabled ?? onMapClickHandler}
    >
      {coordinates &&
        Boolean(coordinates?.length) &&
        [coordinates].map((v) => (
          <Placemark
            key={JSON.stringify(v)}
            onClick={() => markerDisabled && handleMarkClick && handleMarkClick(v)}
            geometry={v}
            options={{
              iconLayout: 'default#image',
              iconImageHref: PvzPinIcon.src,
              iconImageSize: [46, 84],
              iconImageOffset: [-23, -84]
            }}
          />
        ))}
    </Map>
  )
}

export default Maps
