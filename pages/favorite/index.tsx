import React, { useState } from 'react'
import { meta } from '@/constants'
import { Container, Text, Tabs } from '@/components/UI'
import { FavoriteProducts, FavoriteShops, FavoriteTabValues } from '@/components/favorite'
import Layout from '@/components/layout/Main'

const tabs = [
  {
    id: FavoriteTabValues.PRODUCTS,
    label: 'Товары'
  },
  {
    id: FavoriteTabValues.SHOPS,
    label: 'Магазины'
  }
]

const Favorite = () => {
  const [activeTab, setActiveTab] = useState<FavoriteTabValues>(FavoriteTabValues.PRODUCTS)

  return (
    <Layout meta={{ ...meta.FAVORITE }}>
      <Container>
        <Text as='h2'>Избранное</Text>
        <Tabs active={activeTab} className='offset-top-24' onClick={setActiveTab} tabs={tabs} />
        <div className='offset-top-24'>
          {activeTab === FavoriteTabValues.PRODUCTS && <FavoriteProducts />}
          {activeTab === FavoriteTabValues.SHOPS && <FavoriteShops />}
        </div>
      </Container>
    </Layout>
  )
}

export default Favorite
