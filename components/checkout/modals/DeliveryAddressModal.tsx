import React, { useState } from 'react'
import cx from 'classnames'
import { IStore, TShopAddress, EStoreDeliveryMethodType, TUserAddress } from '@/models'
import { Button, Icon, Modal, Text, Tooltip } from '@/components/UI'
import NewDeliveryAddressModal from './NewDeliveryAddressModal'
import DeleteDeliveryAddressModal from './DeleteDeliveryAddressModal'
import s from './checkout-modals.module.scss'

interface IDeliveryAddressModalProps {
  shop: IStore | undefined
  data: TShopAddress[] | TUserAddress[]
  activeDeliveryAddresses: string | null
  activeDeliveryMethod: EStoreDeliveryMethodType | undefined
  onDeliveryAddress: (shop: IStore | undefined, addressId: string | null) => void
  onSuccessNewDeliveryAddress: (shop: IStore | undefined, addressId: string) => void
  getUserDeliveryAddress: VoidFunction
  closeParentModal: VoidFunction
}

const DeliveryAddressModal = ({
  shop,
  data,
  activeDeliveryAddresses,
  onDeliveryAddress,
  activeDeliveryMethod,
  onSuccessNewDeliveryAddress,
  getUserDeliveryAddress,
  closeParentModal
}: IDeliveryAddressModalProps) => {
  const [openNewDeliveryAddressModal, setOpenNewDeliveryAddress] = useState<boolean>(false)
  const [removingDeliveryAddress, setRemovingDeliveryAddress] = useState<TUserAddress | null>(null)
  const isSelfDeliveryMethod: boolean = activeDeliveryMethod === ('self-delivery' as EStoreDeliveryMethodType)

  const closeModal = () => setOpenNewDeliveryAddress(false)
  const closeRemovingDeliveryAddressModal = () => setRemovingDeliveryAddress(null)

  const onSuccessNewDeliveryAddressHandler = (addressId: string) => {
    closeModal()
    onSuccessNewDeliveryAddress(shop, addressId)
  }

  const onSuccessRemove = () => {
    if (activeDeliveryAddresses === removingDeliveryAddress?._id) {
      onDeliveryAddress(shop, null)
    }

    closeRemovingDeliveryAddressModal()
    getUserDeliveryAddress()
  }

  if (!shop) return null

  if (!isSelfDeliveryMethod && !data?.length) {
    return (
      <NewDeliveryAddressModal
        savedAddresses={data}
        onSuccessNewDeliveryAddress={onSuccessNewDeliveryAddressHandler}
        onClose={closeParentModal}
      />
    )
  }

  return (
    <div className={s.modal}>
      <Text as='h3' align='center'>
        Адрес доставки
      </Text>
      <div className={s.modal__content}>
        {data.map((v: TShopAddress | TUserAddress) => (
          <div
            key={v._id}
            className={cx(s.item, { [s.active]: v._id === activeDeliveryAddresses })}
            onClick={() => onDeliveryAddress(shop, v._id ?? null)}
          >
            <div className={s.item__data}>
              <Text as='p' className={s.item__title}>
                {v.fullname}
              </Text>
            </div>
            {!isSelfDeliveryMethod && (
              <Tooltip>
                <div className={s.item__tooltip}>
                  <div className={s['tooltip-item']} onClick={() => setRemovingDeliveryAddress(v as TUserAddress)}>
                    <Icon name='remove' color='red' />
                    <Text color='red'>Удалить</Text>
                  </div>
                </div>
              </Tooltip>
            )}
          </div>
        ))}
      </div>
      {!isSelfDeliveryMethod && (
        <Button className={s.modal__button} onClick={() => setOpenNewDeliveryAddress(true)} fluid>
          Добавить новый адрес доставки
        </Button>
      )}

      <Modal isOpen={openNewDeliveryAddressModal} size='full' closePlace={null} topBottomBorder={false}>
        <NewDeliveryAddressModal
          savedAddresses={data}
          onSuccessNewDeliveryAddress={onSuccessNewDeliveryAddressHandler}
          onClose={closeModal}
        />
      </Modal>
      <Modal isOpen={!!removingDeliveryAddress} onRequestClose={closeRemovingDeliveryAddressModal} size='sm'>
        <DeleteDeliveryAddressModal
          data={removingDeliveryAddress}
          onCloseModal={closeRemovingDeliveryAddressModal}
          onSuccessRemove={onSuccessRemove}
        />
      </Modal>
    </div>
  )
}

export default DeliveryAddressModal
