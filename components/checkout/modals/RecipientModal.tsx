import React, { useState } from 'react'
import cx from 'classnames'
import { IStore, TUserRecipient } from '@/models'
import { Button, Icon, Modal, Text, Tooltip } from '@/components/UI'
import NewRecipientModal from '@/components/checkout/modals/NewRecipientModal'
import DeleteRecipient from '@/components/checkout/modals/DeleteRecipientModal'
import EditRecipientModal from '@/components/checkout/modals/EditRecipientModal'
import s from './checkout-modals.module.scss'

interface IRecipientModalModalProps {
  shop: IStore | undefined
  recipients: TUserRecipient[]
  activeRecipient: TUserRecipient | undefined
  onRecipient: (shop: IStore | undefined, recipient: TUserRecipient) => void
  onSuccessNewRecipient: (shop: IStore | undefined, userId: string) => void
  onSuccessRemoveRecipient: (shop: IStore | undefined, userId: string) => void
  getUserData: VoidFunction
}

const RecipientModal = ({
  shop,
  recipients,
  activeRecipient,
  onRecipient,
  onSuccessNewRecipient,
  onSuccessRemoveRecipient,
  getUserData
}: IRecipientModalModalProps) => {
  const [openNewRecipientModal, setOpenNewRecipientModal] = useState<boolean>(false)
  const [editingCandidate, setEditingCandidate] = useState<TUserRecipient | null>(null)
  const [erasureCandidate, setErasureCandidate] = useState<TUserRecipient | null>(null)

  const handlerEditRecipientModal = (recipient: TUserRecipient | null) => setEditingCandidate(recipient)
  const handlerRemoveRecipient = (recipient: TUserRecipient | null) => setErasureCandidate(recipient)

  const onSuccessNewRecipientHandler = (userId: string) => {
    setOpenNewRecipientModal(false)
    onSuccessNewRecipient(shop, userId)
  }

  const onSuccessRemoveRecipientHandler = (userId: string) => {
    handlerRemoveRecipient(null)
    onSuccessRemoveRecipient(shop, userId)
  }

  if (!shop) return null

  if (!recipients?.length) {
    return <NewRecipientModal onSuccessNewRecipient={onSuccessNewRecipientHandler} prefill />
  }

  return (
    <div className={s.modal}>
      <Text as='h3' align='center'>
        Получатель
      </Text>
      <div className={s.modal__content}>
        {recipients.map((v: TUserRecipient) => (
          <div
            className={cx(s.item, { [s.active]: v._id === activeRecipient?._id })}
            key={v._id}
            onClick={() => onRecipient(shop, v)}
          >
            <div className={s.item__data}>
              <Text as='p' className={s.item__title}>
                {v.firstName} {v?.lastName}
              </Text>
              <div className={s.item__description}>
                <Text as='p' size='xxs' color='gray' weight='light'>
                  {v.phone}
                </Text>
                <Text as='p' size='xxs' color='gray' weight='light'>
                  {v.email}
                </Text>
              </div>
            </div>
            <Tooltip>
              <div className={s.item__tooltip}>
                <div className={s['tooltip-item']} onClick={() => handlerEditRecipientModal(v)}>
                  <Icon name='edit' />
                  <Text>Изменить</Text>
                </div>
                <div className={s['tooltip-item']} onClick={() => handlerRemoveRecipient(v)}>
                  <Icon name='remove' color='red' />
                  <Text color='red'>Удалить</Text>
                </div>
              </div>
            </Tooltip>
          </div>
        ))}
      </div>
      <Button className={s.modal__button} onClick={() => setOpenNewRecipientModal(true)} fluid>
        Добавить нового получателя
      </Button>

      <Modal isOpen={openNewRecipientModal} onRequestClose={() => setOpenNewRecipientModal(false)} size='sm'>
        <NewRecipientModal onSuccessNewRecipient={onSuccessNewRecipientHandler} />
      </Modal>
      <Modal isOpen={Boolean(erasureCandidate as object)} onRequestClose={() => handlerRemoveRecipient(null)} size='sm'>
        {erasureCandidate && (
          <DeleteRecipient
            onSuccessRemoveRecipient={onSuccessRemoveRecipientHandler}
            closeModal={() => handlerRemoveRecipient(null)}
            recipient={erasureCandidate}
          />
        )}
      </Modal>
      <Modal
        isOpen={Boolean(editingCandidate as object)}
        onRequestClose={() => handlerEditRecipientModal(null)}
        size='sm'
      >
        {editingCandidate && (
          <EditRecipientModal
            getUserData={getUserData}
            closeModal={() => handlerEditRecipientModal(null)}
            recipient={editingCandidate}
          />
        )}
      </Modal>
    </div>
  )
}

export default RecipientModal
