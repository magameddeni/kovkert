import React, { useRef, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { useYMaps } from '@pbe/react-yandex-maps'
import { TShopAddress, TUserAddress } from '@/models'
import { setCoordinates } from '@/helpers'
import { useWindowSize, useMessage } from '@/hooks'
import { Button, ButtonGroup, Col, DotsLoader, Icon, Input, Row, Text } from '@/components/UI'
import Maps from '@/components/Map'
import $api from '@/components/Http/axios'
import s from './checkout-modals.module.scss'

interface INewDeliveryAddressModalProps {
  onClose: VoidFunction
  savedAddresses: TShopAddress[] | TUserAddress[]
  onSuccessNewDeliveryAddress: (addressId: string) => void
}

type TAddressWithCoords = Pick<TUserAddress, 'coordinates' | 'fullname'>

type TFormData = {
  fullname: string
  porch?: string
  sfloor?: string
  sflat?: string
  intercom?: string
}

const NewDeliveryAddressModal = ({
  onClose,
  onSuccessNewDeliveryAddress,
  savedAddresses
}: INewDeliveryAddressModalProps) => {
  const [isGettingUserLocalCoords, setIsGettingUserLocalCoords] = useState<boolean>(false)
  const [foundLocations, setFoundLocations] = useState<TAddressWithCoords[]>([])
  const [selectedAddress, setSelectedAddress] = useState<(TUserAddress & TAddressWithCoords) | null>(null)
  const [openOptions, setOpenOptions] = useState<boolean>(false)
  const { deviceWidth } = useWindowSize()
  const ymaps: any = useYMaps(['Map', 'geocode'])
  const searchWrapRef = useRef(null)

  const {
    handleSubmit,
    register,
    setValue,
    control,
    formState: { errors }
  } = useForm<TFormData>()

  const getAddressByCoordinates = async (coordinates: string[]) => {
    const geocode = await ymaps.geocode(coordinates)
    return geocode?.geoObjects?.get(0)?.getAddressLine()
  }

  const getCoordinates = async (position: any) => {
    const { latitude, longitude } = position.coords
    const addressName = await getAddressByCoordinates([latitude, longitude])

    setValue('fullname', addressName)
    setSelectedAddress({ coordinates: [latitude, longitude], fullname: addressName || '' })
    setIsGettingUserLocalCoords(false)
    await setCoordinates(position)
  }

  const setLocationData = (data: TUserAddress | TAddressWithCoords) => {
    if (!data?.fullname) return

    setValue('fullname', data.fullname)
    setSelectedAddress(data)
    setFoundLocations([])
    setOpenOptions(false)
  }

  const onAddressSearchInput = async (address: string) => {
    if (ymaps) {
      const results: TAddressWithCoords[] = []
      let geocode

      try {
        setOpenOptions(true)

        geocode = await ymaps.geocode(address, {
          kind: 'house',
          provider: 'yandex#map'
        })
      } catch {
        setOpenOptions(false)
        return setFoundLocations([])
      }

      for (let i = 0; i < geocode.geoObjects.getLength(); i++) {
        const element = geocode.geoObjects.get(i)

        results.push({
          fullname: element.getAddressLine(),
          coordinates: element.geometry.getCoordinates()
        })
      }

      setOpenOptions(Boolean(results?.length))
      setFoundLocations(results)
    }
  }

  const onClickOutsideResult = (e: any) => {
    const element = e.target

    // @ts-ignore
    if (searchWrapRef.current && !searchWrapRef.current?.contains(element)) {
      e.preventDefault()
      e.stopPropagation()
      setOpenOptions(false)
    }
  }

  const onFocusAddressInput = () => {
    document.body.addEventListener('click', onClickOutsideResult)
    if (foundLocations?.length) setOpenOptions(true)
  }

  const onUseMyLocation = async () => {
    const lsCoords = localStorage.getItem('coords')

    if (lsCoords) {
      const cord: Record<string, string> = JSON.parse(lsCoords)
      const addressName = await getAddressByCoordinates([cord.latitude, cord.longitude])

      setValue('fullname', addressName)
      setSelectedAddress({
        coordinates: [Number(cord.latitude), Number(cord.longitude)],
        fullname: addressName || ''
      })
      setIsGettingUserLocalCoords(false)
      return
    }

    const errorOnGetMyLocation = (err: any) => {
      useMessage('Геолокация не поддерживается. Проверьте настройки браузера', 'error')
      setIsGettingUserLocalCoords(false)
      console.error(`ERROR(${err?.code}): ${err?.message}`)
    }

    if (navigator.geolocation) {
      setIsGettingUserLocalCoords(true)
      navigator.geolocation.getCurrentPosition(getCoordinates, errorOnGetMyLocation, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      })
    } else {
      useMessage('Геолокация не поддерживается', 'error')
    }
  }

  const onSubmit = async (data: TFormData) => {
    try {
      if (data && selectedAddress) {
        const geocode = ymaps && (await ymaps.geocode(selectedAddress.coordinates, { kind: 'house' }))
        const locationObject: any = geocode?.geoObjects?.get(0)

        const finalData = {
          coordinates: selectedAddress.coordinates,
          street: selectedAddress?.street || locationObject?.getThoroughfare(),
          building: selectedAddress?.building || locationObject?.getPremiseNumber(),
          city: selectedAddress?.city || locationObject?.getLocalities()[0],
          comment: data?.intercom,
          fullname: data.fullname,
          porch: data?.porch,
          sflat: data?.sflat,
          sfloor: data?.sfloor
        }
        const [newLatitude, newLongitude] = finalData.coordinates

        const findAddress = savedAddresses.find((a) => {
          const [latitude, longitude] = a.coordinates
          return a.fullname === finalData.fullname || (latitude === newLatitude && longitude === newLongitude)
        })

        if (!findAddress) {
          const response = await $api.post('/api/v1.0/users/addresses', finalData)
          const responseData: TUserAddress = response.data

          if (responseData?._id) {
            onSuccessNewDeliveryAddress(responseData._id as string)
          }
        } else useMessage('Данные адрес уже сохранен!', 'error')
      }
    } catch (err: any) {
      console.error(err)
    }
  }

  return (
    <div className={s['new-delivery-address']}>
      <div className={s['new-delivery-address__map']}>
        <Maps
          width='100%'
          height='100%'
          coordinates={selectedAddress ? selectedAddress.coordinates : []}
          onMapClick={setLocationData}
        />
      </div>
      <div className={s['new-delivery-address__form']}>
        <Button view='secondary' className={s['button-back']} onClick={onClose}>
          Назад
        </Button>
        <Text as='p' className={s.title} family='secondary'>
          Адрес доставки
        </Text>
        <form className='offset-top-24' onSubmit={handleSubmit(onSubmit)} ref={searchWrapRef}>
          <div className={s['address-input-wrapper']}>
            <Controller
              name='fullname'
              control={control}
              rules={{ required: { value: true, message: 'Не заполнен адрес' } }}
              render={({ field: { name, value, onChange } }) => (
                <Input
                  name={name}
                  view='base'
                  value={value || ''}
                  onChange={(e) => {
                    onChange(e)
                    onAddressSearchInput(e.target.value)
                  }}
                  onFocus={onFocusAddressInput}
                  label='Город, улица, номер дома'
                  errors={errors}
                  fluid
                  required
                />
              )}
            />
            {openOptions && (
              <div className={s.options}>
                {foundLocations.map((v: TAddressWithCoords) => (
                  <div
                    key={JSON.stringify(v.coordinates)}
                    className={s.options__item}
                    onClick={() => setLocationData(v)}
                  >
                    {v.fullname}
                  </div>
                ))}
              </div>
            )}
          </div>
          {!isGettingUserLocalCoords ? (
            <div className={s['use-location']} onClick={onUseMyLocation}>
              <Icon name='pin' color='blue' />
              <Text as='p' color='blue'>
                Использовать моё текущее местоположение
              </Text>
            </div>
          ) : (
            <div className={s['dots-loader']}>
              <DotsLoader />
            </div>
          )}
          <Row className={s.row}>
            <Col xs={6}>
              <Input name='porch' view='base' label='Подъезд' register={register} fluid />
            </Col>
            <Col xs={6}>
              <Input name='sfloor' view='base' label='Этаж' register={register} fluid />
            </Col>
            <Col xs={6}>
              <Input name='sflat' view='base' label='Квартира' register={register} fluid />
            </Col>
            <Col xs={6}>
              <Input name='intercom' view='base' label='Домофон' register={register} fluid />
            </Col>
          </Row>
          <ButtonGroup className={s.buttons}>
            <Button type='submit' fluid={deviceWidth !== 'small'}>
              Сохранить
            </Button>
            <Button className={s['button-back-mobile']} onClick={onClose} fluid={deviceWidth !== 'small'}>
              Назад
            </Button>
          </ButtonGroup>
        </form>
      </div>
    </div>
  )
}

export default NewDeliveryAddressModal
