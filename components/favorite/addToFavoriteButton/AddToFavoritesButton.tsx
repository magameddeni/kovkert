import React, { ReactNode, useMemo } from 'react'
import Image from 'next/image'
import { IColor, IProduct, ISize, IStore } from '@/models'
import { Icon, Text } from '@/components/UI'
import { useAppDispatch, useAppSelector } from '@/redux/hook'
import { addProduct, addShop, deleteProduct, deleteShop } from '@/redux/favorite/favoritesSlice'
import { useAddToFavoritesMutation, useDeleteFromFavoritesMutation } from '@/redux/favorite/favoritesApi'
import s from './favorite.module.scss'

type ISizeButton = ISize['size'] | number

interface Props extends IColor {
  as?: 'icon' | 'image'
  size?: ISizeButton
  item: IProduct | IStore
  text?: ReactNode | string
  type?: 'Product' | 'Shop'
  clickOutsideArea?: number | undefined
  removeFavoritesInterceptor?: (arg0: IProduct) => Promise<string>
}

export const AddToFavoritesButton: React.FC<Props> = ({
  as = 'icon',
  item,
  text,
  size = 'xl',
  color,
  type = 'Product',
  removeFavoritesInterceptor,
  clickOutsideArea
}) => {
  const dispatch = useAppDispatch()
  const userState = useAppSelector(({ beru }) => beru.user)
  const favorites = useAppSelector(({ beru }) => beru.favorite)

  const isFavorite = useMemo(() => {
    const items = type === 'Product' ? 'products' : 'shops'
    return Boolean(favorites[items]?.find((favorite) => favorite?._id === item._id))
  }, [favorites, item._id, type])

  const [addToFavorites, { isLoading: isAddingFav }] = useAddToFavoritesMutation()
  const [removeFromFavorites, { isLoading: isDeletingFav }] = useDeleteFromFavoritesMutation()

  const handleAddToFavorites = (favoritesProductId: string | undefined) => {
    if (favoritesProductId) {
      if (userState.isLoggedIn) {
        addToFavorites({
          item,
          type
        })
      } else if (type === 'Product') {
        dispatch(addProduct(item as IProduct))
      } else {
        dispatch(addShop(item as IStore))
      }
    }
  }

  const handleRemoveFromFavorites = (favoritesProductId: string | undefined) => {
    if (favoritesProductId) {
      if (userState.isLoggedIn) {
        removeFromFavorites({
          item,
          type
        })
      } else if (type === 'Product') {
        dispatch(deleteProduct(item as IProduct))
      } else {
        dispatch(deleteShop(item as IStore))
      }
    }
  }

  const handleClick = async () =>
    isFavorite
      ? removeFavoritesInterceptor
        ? type === 'Product' && removeFavoritesInterceptor(item as IProduct).then(handleRemoveFromFavorites)
        : handleRemoveFromFavorites(item._id)
      : handleAddToFavorites(item._id)

  const icon = useMemo(() => {
    if (as === 'image') {
      return { name: isFavorite ? '/like-active.svg' : '/like.svg' }
    }

    return {
      name: isFavorite ? 'heart-fill' : 'heart',
      color: isFavorite ? 'red' : color
    }
  }, [isFavorite, as])

  const outsideAreaStyles = useMemo(() => {
    if (clickOutsideArea) {
      return {
        padding: `${clickOutsideArea}px`,
        margin: `-${clickOutsideArea}px`
      }
    }
  }, [clickOutsideArea])

  if (!item?._id) return null

  return (
    <button
      className={s.btn_favorite}
      disabled={isAddingFav || isDeletingFav}
      onClick={handleClick}
      style={{ ...outsideAreaStyles }}
    >
      {as === 'icon' ? (
        <Icon name={icon.name} size={size as ISize['size']} color={icon.color as IColor['color']} />
      ) : (
        <Image src={icon.name} width={size as number} height={size as number} quality={90} alt='' priority />
      )}
      {Boolean(text) && <Text> {isFavorite ? text : 'В избранное'}</Text>}
    </button>
  )
}
