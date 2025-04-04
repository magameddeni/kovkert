import $api from '../Http/axios'

export const unSubscribeUser = async (item: any) => {
  const res = await $api.post('/api/shop/subscribe', { shopId: item?.id })

  if (res.status !== 200) throw new Error('Ошибка. Не удалось отписаться. Попробуйте еще раз!')

  return res.data
}

export const lookedUserStories = async ({ story }: any) => {
  const res = await $api.put('/api/v1.0/stories', { story })

  if (res.status !== 200) throw new Error('Ошибка.')
  return res.data
}
