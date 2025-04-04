import React, { useEffect, useRef } from 'react'
import Link from 'next/link'
import { routes } from '@/constants'
import { useGetFavoritesMutation } from '@/redux/favorite/favoritesApi'
import { useAppSelector } from '@/redux/hook'
import { AddToFavoritesButton, FavoriteShopsSkeleton } from '@/components/favorite'
import { Col, Row } from '@/components/UI'
import ShopAvatar from '@/components/ShopAvatar'
import styles from './styles.module.scss'

export const FavoriteShops = () => {
  const [getFavorites, { isLoading }] = useGetFavoritesMutation()
  const favorites = useAppSelector(({ beru }) => beru.favorite?.shops)
  const auth = useAppSelector(({ beru }) => beru.user)

  const favoritesRef = useRef(favorites)

  useEffect(() => {
    if (auth.isLoggedIn) {
      getFavorites({ type: 'Shop' })
    }
  }, [])

  const renderProducts = () =>
    favoritesRef?.current?.map((favorite) => (
      <Col sm={6} lg={4}>
        <article key={favorite.slug} className={styles.shop}>
          <header className={styles.shop__header}>
            <div className={styles.shop__info}>
              <ShopAvatar image={favorite.image} name={favorite.name} width={38} height={38} />
              <h3 className={styles.shop__title}>{favorite.name}</h3>
            </div>
            <AddToFavoritesButton type='Shop' item={favorite} />
          </header>
          <Link className={styles.shop__link} href={`${routes.SHOP}/${favorite.slug}`}>
            Перейти в магазин
          </Link>
        </article>
      </Col>
    ))

  if (!favoritesRef?.current?.length) return <div>Избранных магазинов нет</div>

  return (
    <Row row={16} small>
      {isLoading ? <FavoriteShopsSkeleton /> : renderProducts()}
    </Row>
  )
}
