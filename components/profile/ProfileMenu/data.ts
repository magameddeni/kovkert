import { routes } from '@/constants'
import { ProfileTabValues } from '@/components/profile/types'

const menuItems = [
  {
    id: ProfileTabValues.ORDERS,
    icon: 'box-light',
    link: routes.ORDERS,
    title: 'Мои заказы'
  },
  {
    id: ProfileTabValues.CHAT,
    icon: 'message-light',
    link: routes.CHAT,
    title: 'Сообщения'
  },
  {
    id: ProfileTabValues.PARTNER,
    icon: 'partnership',
    link: routes.PARTNER,
    title: 'Партнерская программа'
  },
  {
    id: ProfileTabValues.REVIEWS,
    icon: 'edit-light',
    link: routes.REVIEWS,
    title: 'Мои отзывы'
  },
  {
    id: ProfileTabValues.INFO,
    icon: 'user-light',
    link: '/messenger',
    title: 'Личные данные'
  }
]

export { menuItems }
