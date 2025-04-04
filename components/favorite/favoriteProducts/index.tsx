import React, { useEffect, useState } from 'react'
import { IProduct } from '@/models'
import { useWindowSize } from '@/hooks'
import { useAppSelector, useAppDispatch } from '@/redux/hook'
import { updateStock } from '@/redux/favorite/favoritesSlice'
import { useGetFavoritesMutation } from '@/redux/favorite/favoritesApi'
import { ProductItem } from '@/components/product'
import { FavoriteProductsSkeleton } from '@/components/favorite'
import { Col, Row } from '@/components/UI'
import $api from '@/components/Http/axios'
import styles from './styles.module.scss'

export const FavoriteProducts = () => {
  const [getFavorites, { isLoading }] = useGetFavoritesMutation()
  const { products: favorites } = useAppSelector(({ beru }) => beru.favorite)
  const auth = useAppSelector(({ beru }) => beru.user)

  const [listForDeletion, setListForDeletion] = useState<IProduct[]>(favorites)
  const { isSmall, isLarge } = useWindowSize()
  const dispatch = useAppDispatch()

  const removeFavoritesInterceptor = async (payload: IProduct): Promise<string> => {
    setListForDeletion((pre: IProduct[]) =>
      pre.map((item) => {
        if (item._id === payload._id) return payload
        return item
      })
    )
    return payload._id
  }

  useEffect(() => {
    if (auth.isLoggedIn) {
      getFavorites({ type: 'Product' })
    } else {
      const favoriteProductIds = favorites.map(({ _id }) => _id)
      $api
        .get<IProduct[]>(`/api/products/watched/${JSON.stringify(favoriteProductIds)}`)
        .then(({ data }) => data.map((product) => dispatch(updateStock(product))))
    }
  }, [])

  const renderProducts = () =>
    listForDeletion.map((favorite) => (
      <Col key={favorite._id} xs={6} sm={4} lg={3} className={styles['product-item-wrapper']}>
        <ProductItem product={favorite} removeFavoritesInterceptor={removeFavoritesInterceptor} />
      </Col>
    ))

  if (!favorites?.length && !listForDeletion.length) return <div>Товаров нет</div>

  return (
    <Row row={isSmall ? 16 : 20} small={!isLarge}>
      {isLoading ? <FavoriteProductsSkeleton /> : renderProducts()}
    </Row>
  )
}
