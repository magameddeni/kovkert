import React, { FC, useState } from 'react'
import { IStore } from '@/models'
import { routes } from '@/constants'
import { useWindowSize } from '@/hooks'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/redux/hook'
import { useQuery } from '@tanstack/react-query'
import { Icon, Modal, Text } from '@/components/UI'
import emitter, { EVENTS } from '@/utils/emitter'
import $api from '@/components/Http/axios'
import ShopAvatar from '@/components/ShopAvatar'
import { AddToFavoritesButton } from '@/components/favorite'
import { MessengerContextProvider } from '@/components/chat/MessengerContext'
import { ChatModal } from '@/components/chat/chatModal'
import { ShopInfoModal } from '../Modals'
import s from './shop-header.module.scss'

interface ShopHeaderProps {
  shop: IStore
  onShopName?: VoidFunction
}

export const ShopHeader: FC<ShopHeaderProps> = ({ shop, onShopName }) => {
  const router = useRouter()
  const [showChat, setShowChat] = useState(false)
  const { deviceWidth, isSmall } = useWindowSize()
  const [conversationId, setConversationId] = useState(null)
  const [isShowInfo, setIsShowInfo] = useState<boolean>(false)
  const userId = useAppSelector(({ beru }) => beru.user.data?._id)

  const { data } = useQuery({
    queryKey: [`/api/shop/stories?sid=${shop._id}`],
    queryFn: async () => {
      const response = await $api.get(`/api/shop/stories?sid=${shop._id}`)
      return response.data
    }
  })

  const onCLoseCHatModal = () => setShowChat(false)
  const onOpenCHatModal = () => setShowChat(true)

  const createConversation = () => {
    if (!userId) return emitter.emit(EVENTS.SHOW_LOGIN_MODAL)

    $api
      .post('/api/chat/checkconversation', {
        users: [
          { participant: userId, participantModel: 'User' },
          { participant: shop._id, participantModel: 'Shop' }
        ]
      })
      .then(({ data: chatData }) => {
        if (isSmall) router.push(`${routes.CHAT}?activeChat=${chatData}&shop=true`)
        else {
          setConversationId(chatData)
          onOpenCHatModal()
        }
      })
  }

  return (
    <div className={s['shop-header-wrapper']}>
      <div className={s['shop-header']}>
        <div className={s['shop-header__left']}>
          <ShopAvatar image={shop.image} stories={data?.stories || []} name={shop.name} width={48} height={48} />
          <div className={s['shop-name']}>
            <Text as='h3' className={s['shop-name__name']} onClick={onShopName || (() => {})}>
              {shop.name}
            </Text>
            {deviceWidth !== 'large' && (
              <div className={s['shop-name__info']}>
                <div className={s.rating}>
                  <Icon name='like' size='xs' />
                  <Text size='xxs'>4.8</Text>
                </div>
                <Text size='xxs' weight='regular' className={s['about-shop']} onClick={() => setIsShowInfo(true)}>
                  О магазине
                </Text>
              </div>
            )}
          </div>
        </div>
        <div className={s['shop-header__right']}>
          <div className={s.button} onClick={createConversation}>
            <Icon name='message' size='lg' />
            <Text className={s.button__text}>Чат</Text>
          </div>
          {deviceWidth === 'large' && (
            <div className={s.button} onClick={() => setIsShowInfo(true)}>
              <Icon name='info' size='lg' />
              <Text className={s.button__text}>Информация</Text>
            </div>
          )}
          <div className={s.button}>
            <AddToFavoritesButton type='Shop' size='lg' item={shop} text={deviceWidth === 'large' && 'В избранном'} />
          </div>
        </div>
      </div>

      <Modal isOpen={isShowInfo} onRequestClose={() => setIsShowInfo(false)} size='sm'>
        <ShopInfoModal shop={shop} />
      </Modal>
      <Modal
        topBottomBorder={false}
        closePlace={null}
        style={{ width: '854px!important' }}
        isOpen={showChat}
        onRequestClose={onCLoseCHatModal}
      >
        <MessengerContextProvider>
          <ChatModal conversationId={conversationId} />
        </MessengerContextProvider>
      </Modal>
    </div>
  )
}
