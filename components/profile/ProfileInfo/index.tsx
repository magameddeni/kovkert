import React, { useState } from 'react'
import cx from 'classnames'
import { AppState } from '@/redux/store'
import { useAppSelector } from '@/redux/hook'
import { Button, Modal } from '@/components/UI'
import ConfirmedIcon from '@/public/confirmedIcon.svg'
import WarningIcon from '@/public/warningIcon.svg'
import { EditEmailModal, EditPhoneModal, RemoveAccountModal } from '../modals'
import ProfileForm from '../ProfileForm'
import s from './styles.module.scss'

const ProfileInfo = () => {
  const [openedModal, setOpenedModal] = useState<'editEmail' | 'editNumber' | 'removeAccount' | ''>('')
  const auth = useAppSelector(({ beru }: AppState) => beru.user)

  const hasEmail = Boolean(auth?.data?.email)
  const hasPhoneNumber = Boolean(auth?.data?.phoneNumber)

  const closeModal = () => setOpenedModal('')

  return (
    <div className={s['profile-info']}>
      <div className={cx(s['profile-info__border-block'], s['info-block'])}>
        <div className={s.data}>
          <div className={s.data__row}>
            <div className={s.data__label}>Телефон</div>
            {hasPhoneNumber && (
              <Button view='link' className={s.data__btn} onClick={() => setOpenedModal('editNumber')}>
                Изменить
              </Button>
            )}
          </div>
          <div className={s.data__row}>
            <div className={s.data__value}>{auth?.data?.phoneNumber ?? 'Не указан'}</div>
          </div>
        </div>
        <div className={s.data}>
          <div className={s.data__row}>
            <div className={s.data__label}>E-mail</div>
            {hasEmail ? (
              <Button onClick={() => setOpenedModal('editEmail')} view='link' className={s.data__btn}>
                Изменить
              </Button>
            ) : (
              <Button onClick={() => setOpenedModal('editEmail')} view='link' className={s.data__btn}>
                Добавить почту
              </Button>
            )}
          </div>
          <div className={s.data__row}>
            <div className={s.data__value}>{auth?.data?.email ?? 'Не указана'}</div>
            {hasEmail && (
              <div className={s.email_status}>
                {auth?.data?.emailConfirmed ? (
                  <div className={s.email_status__col}>
                    <ConfirmedIcon />
                    <span className={s.green}>Почта подтверждена</span>
                  </div>
                ) : (
                  <div className={s.email_status__col}>
                    <WarningIcon />
                    <span className={s.red}>Почта не подтверждена</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <ProfileForm />
      </div>
      <div className={s['profile-info__border-block']}>
        <Button view='link' color='red' onClick={() => setOpenedModal('removeAccount')}>
          Удалить аккаунт
        </Button>
      </div>

      <Modal isOpen={openedModal === 'editEmail'} onRequestClose={closeModal} size='sm'>
        <EditEmailModal onClose={closeModal} />
      </Modal>
      <Modal isOpen={openedModal === 'editNumber'} onRequestClose={closeModal} size='sm'>
        <EditPhoneModal onClose={closeModal} />
      </Modal>
      <Modal isOpen={openedModal === 'removeAccount'} onRequestClose={closeModal} size='sm'>
        <RemoveAccountModal onClose={closeModal} />
      </Modal>
    </div>
  )
}

export default ProfileInfo
