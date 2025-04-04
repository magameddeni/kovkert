import React, { useMemo, useState } from 'react'
import cx from 'classnames'
import {
  IStore,
  TShopAddress,
  EStoreDeliveryMethodType,
  TUserAddress,
  TUserRecipient,
  TCheckoutItemItem,
  TCheckoutItem
} from '@/models'
import { setSpaceBetweenCharacters } from '@/helpers'
import { DotsLoader, Modal, Select, Text } from '@/components/UI'
import { useWindowSize } from '@/hooks'
import { ProductImage } from '@/components/product'
import RecipientModal from './modals/RecipientModal'
import DeliveryAddressModal from './modals/DeliveryAddressModal'
import AddressPVZ from '../Modals/AddressPVZ/AddressPVZ'
import s from './checkout.module.scss'

interface ICheckoutStoreItemsProps {
  shop: IStore | undefined
  checkoutItems: TCheckoutItem
  recipients: TUserRecipient[]
  courierDeliveryAddresses: any
  activeDeliveryAddresses: string | null
  activeRecipient: TUserRecipient | undefined
  activeDeliveryMethod: EStoreDeliveryMethodType | undefined
  onDeliveryAddress: (shop: IStore | undefined, addressId: string | null) => void
  onRecipient: (shop: IStore | undefined, recipient: TUserRecipient) => void
  onDeliveryMethod: (shop: IStore | undefined, deliveryMethod: EStoreDeliveryMethodType) => void
  onSuccessNewRecipient: (shop: IStore | undefined, userId: string) => void
  onSuccessRemoveRecipient: (shop: IStore | undefined, userId: string) => void
  onSuccessNewDeliveryAddress: (shop: IStore | undefined, addressId: string) => void
  getUserData: VoidFunction
  getUserDeliveryAddress: VoidFunction
}

const CheckoutStoreItems = ({
  shop,
  checkoutItems,
  recipients,
  courierDeliveryAddresses,
  activeDeliveryAddresses,
  activeRecipient,
  activeDeliveryMethod,
  onDeliveryAddress,
  onRecipient,
  onDeliveryMethod,
  onSuccessNewRecipient,
  onSuccessRemoveRecipient,
  onSuccessNewDeliveryAddress,
  getUserData,
  getUserDeliveryAddress
}: ICheckoutStoreItemsProps) => {
  const [openRecipientModal, setOpenRecipientModal] = useState<'recipient' | 'address' | null>(null)

  const isSelfDeliveryMethod = activeDeliveryMethod === EStoreDeliveryMethodType.SELF_DELIVERY
  const addressesData = isSelfDeliveryMethod ? shop?.addresses : courierDeliveryAddresses
  const courierDeliveryMethodWithoutAddresses =
    activeDeliveryMethod === EStoreDeliveryMethodType.COURIER && !addressesData?.length
  const { isSmall } = useWindowSize()

  const addressForSelect = useMemo(
    () => ({
      value: 'address',
      label: activeDeliveryAddresses
        ? addressesData.find((v: TShopAddress | TUserAddress) => v._id === activeDeliveryAddresses)?.fullname
        : activeDeliveryMethod === EStoreDeliveryMethodType.SELF_DELIVERY
          ? shop?.addresses[0].fullname
          : 'Адрес доставки'
    }),
    [activeDeliveryAddresses, activeDeliveryMethod]
  )

  const recipientForSelect = useMemo(
    () => ({
      value: 'recipient',
      label: activeRecipient ? (
        <Text>
          {activeRecipient?.firstName ?? ''} {activeRecipient?.lastName ?? ''}
          <Text color='gray'>{activeRecipient?.phone ? `,  ${activeRecipient?.phone}` : ''}</Text>
        </Text>
      ) : (
        'Получатель'
      )
    }),
    [activeDeliveryAddresses, activeRecipient]
  )

  const closeModal = () => setOpenRecipientModal(null)

  const successNewDeliveryAddressHandler = (shopInfo: IStore | undefined, addressId: string) => {
    onSuccessNewDeliveryAddress(shopInfo, addressId)
    closeModal()
  }

  const successNewRecipientHandler = (shopInfo: IStore | undefined, userId: string) => {
    onSuccessNewRecipient(shopInfo, userId)
    closeModal()
  }

  const deliveryAddressHandler = (shopInfo: IStore | undefined, addressId: string | null) => {
    onDeliveryAddress(shopInfo, addressId)
    closeModal()
  }

  const recipientHandler = (shopInfo: IStore | undefined, recipient: TUserRecipient) => {
    onRecipient(shopInfo, recipient)
    closeModal()
  }

  const onSelectSelfDeliveryMethod = () => {
    onDeliveryMethod(shop, EStoreDeliveryMethodType.SELF_DELIVERY)
    onDeliveryAddress(shop, shop?.addresses?.[0]?._id ?? null)
  }

  const sizeAddressModal = () =>
    courierDeliveryMethodWithoutAddresses
      ? 'full'
      : activeDeliveryMethod === EStoreDeliveryMethodType.SELF_DELIVERY
        ? isSmall
          ? 'full'
          : 'md'
        : 'sm'

  if (!shop) return <DotsLoader />

  return (
    <div className={s['checkout-store-items']}>
      <Text as='p' size='lg' family='secondary'>
        {shop.name}
      </Text>
      <div className={s['checkout-store-items__products']}>
        {checkoutItems.items.map((v: TCheckoutItemItem) => (
          <div key={v._id} className={s.product}>
            <ProductImage
              link={v.product.images?.[0]?.link}
              className={s.product__image}
              addToFavorite={false}
              asLink={false}
              product={v.product as any}
            />
            <div className='offset-top-8'>
              <Text as='p' size='xxs'>
                {setSpaceBetweenCharacters(v.product.discountPrice * v.quantity)} ₽
              </Text>
              <Text size='xxs' color='gray'>
                {v.quantity} шт.
              </Text>
            </div>
          </div>
        ))}
      </div>
      <div className={s['checkout-store-items__delivery-types']}>
        <Text as='p' size='lg' family='secondary'>
          Способ получения
        </Text>
        <div className={s['delivery-type-carts']}>
          <div
            className={cx(s['delivery-type-carts__item'], { [s.active]: isSelfDeliveryMethod })}
            onClick={onSelectSelfDeliveryMethod}
          >
            <Text as='p' family='secondary'>
              Самовывоз
            </Text>
            <Text as='p' size='xxs' className={s.date}>
              <Text size='xxs' family='secondary'>
                бесплатно
              </Text>
            </Text>
          </div>
          <div
            className={cx(s['delivery-type-carts__item'], { [s.active]: !isSelfDeliveryMethod })}
            onClick={() => onDeliveryMethod(shop, EStoreDeliveryMethodType.COURIER)}
          >
            <Text as='p' family='secondary'>
              Курьерская доставка
            </Text>
            <Text as='p' size='xxs' className={s.date}>
              <Text size='xxs' family='secondary'>
                {checkoutItems?.deliveryPrice
                  ? setSpaceBetweenCharacters(checkoutItems?.deliveryPrice.toFixed(0))
                  : 'от 0'}{' '}
                ₽
              </Text>
            </Text>
          </div>
        </div>
      </div>
      <div className='offset-top-24'>
        <div onClick={() => setOpenRecipientModal('address')}>
          <Select
            name='address'
            value={addressForSelect}
            suffixIcon='arrow-right'
            label={
              activeDeliveryMethod === EStoreDeliveryMethodType.SELF_DELIVERY ? 'Место получения' : 'Адрес доставки'
            }
            view='secondary'
            open={false}
            errors={
              !activeDeliveryAddresses && {
                address: { message: 'Обязательное поле' }
              }
            }
            fluid
            disabled
          />
        </div>
        <div onClick={() => setOpenRecipientModal('recipient')}>
          <Select
            name='recipient'
            classNameInputWrapper='offset-top-8'
            value={recipientForSelect}
            suffixIcon='arrow-right'
            label='Получатель'
            view='secondary'
            open={false}
            errors={
              !activeRecipient && {
                recipient: { message: 'Обязательное поле' }
              }
            }
            fluid
            disabled
          />
        </div>
      </div>

      <Modal isOpen={openRecipientModal === 'recipient'} onRequestClose={closeModal} size='sm'>
        <RecipientModal
          shop={shop}
          recipients={recipients}
          activeRecipient={activeRecipient}
          onRecipient={recipientHandler}
          onSuccessNewRecipient={successNewRecipientHandler}
          onSuccessRemoveRecipient={onSuccessRemoveRecipient}
          getUserData={getUserData}
        />
      </Modal>
      <Modal
        isOpen={openRecipientModal === 'address'}
        onRequestClose={closeModal}
        size={sizeAddressModal()}
        closePlace={courierDeliveryMethodWithoutAddresses ? null : 'right'}
        topBottomBorder={false}
      >
        {activeDeliveryMethod === EStoreDeliveryMethodType.SELF_DELIVERY ? (
          <AddressPVZ
            coordinates={shop.addresses[0].coordinates}
            address={shop.addresses[0].fullname}
            phoneNumber={shop.phoneNumber}
            onRequestClose={closeModal}
          />
        ) : (
          <DeliveryAddressModal
            shop={shop}
            data={addressesData}
            activeDeliveryAddresses={activeDeliveryAddresses}
            activeDeliveryMethod={activeDeliveryMethod}
            onDeliveryAddress={deliveryAddressHandler}
            onSuccessNewDeliveryAddress={successNewDeliveryAddressHandler}
            getUserDeliveryAddress={getUserDeliveryAddress}
            closeParentModal={closeModal}
          />
        )}
      </Modal>
    </div>
  )
}

export default CheckoutStoreItems
