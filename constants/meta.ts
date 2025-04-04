import { IProduct } from '@/models'

export const meta = {
  MAIN: {
    title:
      'Интернет магазин строительных материалов, товаров для хозяйства, выгодные цены, доставка по всей России - KOVKERT',
    description:
      'Магазин строительных материалов, товаров для хозяйства и дома по выгодным ценам c самовывозом и доставкой по всей России!. Большой выбор категорий товаров с фильтрацией по характеристиками, отзывами и фото.',
    manifest: '/manifest.json'
  },
  BASKET: {
    title: 'Корзина - KOVKERT'
  },
  CATEGORY: {
    title: 'Каталог товаров - KOVKERT',
    description: 'Каталог товаров. Официальный сайт. Миллионы товаров. Доставка!'
  },
  CATEGORY_SLUG: (data: string) => ({
    title: `${data} - купить все для ${data.toLowerCase()} в Грозном на KOVKERT по низкой цене`,
    description: `${data} в Грозном на KOVKERT по выгодной цене! Быстрая и выгодная доставка, большой ассортимент товаров. Распродажи, скидки и акции на ${data.toLowerCase()}. Реальные отзывы покупателей.`
  }),
  CHAT: {
    title: 'Чаты с магазинами - KOVKERT'
  },
  CHECKOUT: {
    title: 'Оформление заказа - KOVKERT'
  },
  CHECKOUT_SUCCESS: {
    title: 'Заказ оформлен - KOVKERT'
  },
  DOCS: {
    title: 'Документы - KOVKERT'
  },
  FAVORITE: {
    title: 'Избранное - KOVKERT'
  },
  ORDERS: {
    title: 'Заказы - KOVKERT'
  },
  ORDERS_SLUG: {
    title: 'Заказ - KOVKERT'
  },
  PRODUCT: (title: string, keywords: string, data: IProduct) => ({
    title: `Купить ${title} в Грозном по низкой цене! Отзывы, фото, характеристики в интернет-магазине KOVKERT (${data?.barcode})`,
    description: `${title} купить в Грозном за ${data?.discountPrice} ₽ в интернет-магазине KOVKERT. ✔Доставка ✔Фото ✔Скидки и настоящие отзывы (${data?.barcode})`,
    keywords: `${title} ${keywords} купить в Грозном`
  }),
  PROFILE: {
    title: 'Личный кабинет - KOVKERT'
  },
  PROFILE_INFO: {
    title: 'Личные данные - KOVKERT'
  },
  REVIEWS: {
    title: 'Отзывы - KOVKERT'
  },
  REVIEWS_SLUG: {
    title: 'Страница отзыва - KOVKERT'
  },
  SEARCH: (data: string) => ({
    title: `${data} — купить в Грозном на KOVKERT`,
    description: data
  }),
  SHOP: (data: string | undefined) => ({
    title: `${data ?? ''} — купить товары в Грозном в магазине ${data ?? ''}`,
    description: `Каталог товаров магазина ${data ?? ''} в Грозном на KOVKERT: выгодные цены, фото, отзывы. Быстрая доставка`
  }),
  SHOP_AFFILIATE: (data: string | undefined) => ({
    title: `Партнерская программа магазина ${data ?? ''} - вы можете зарабатывать баллы, если по вашей ссылке будет оформлен заказ!`
  }),
  AFFILIATE: {
    title: `Партнерские программы - вы можете зарабатывать баллы, если по вашей ссылке будет оформлен заказ!`
  },
  ERROR_PAGE: (data?: string | undefined) => ({
    title: data ?? '404 - KOVKERT'
  }),
  NOT_AUTHORIZED: {
    title: 'Для доступа в данный раздел нужно авторизоваться - KOVKERT'
  },
  OFFERS: {
    title: 'Заказы - KOVKERT'
  },
  PARTNER: {
    title: 'Партнёрские программы - KOVKERT'
  },
  BRAND_SLUG: (data: string) => ({
    title: `${data} - товары бренда ${data} купить по выгодным ценам на официальном сайте на KOVKERT в Грозном`,
    description: `Каталог товаров ${data} на официальном сайте на KOVKERT. Выгодные цены на продукцию ${data}! ✔ Характеристики ✔ Фото ✔ Ассортимент ✔ Отзывы ✔ Гарантия ✔ Доставка!`
  })
}
