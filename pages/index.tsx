import React from 'react'
import { meta } from '@/constants'
import { Container } from '@/components/UI'
import { TBanner, TOffer } from '@/models'
import Layout from '@/components/layout/Main'
import CategoriesSlider from '@/components/homePage/CategoriesSlider'
import BannersSlider from '@/components/homePage/BannersSlider'
import OffersSlider from '@/components/homePage/OffersSlider'
import $api from '@/components/Http/axios'
import { useWindowSize } from '@/hooks'

export const getServerSideProps = async () => {
  try {
    const { data: banners, status: bannerStatus } = await $api.get('/api/banner')
    const { data: offers, status: offerStatus } = await $api.get('/api/offers/getAll')

    return { props: { banners: bannerStatus === 200 ? banners : [], offers: offerStatus === 200 ? offers?.data : [] } }
  } catch (error) {
    return { props: { banners: [], offers: [] } }
  }
}

const HomePage = ({ banners, offers }: { banners: TBanner[]; offers: TOffer[] }) => {
  const { width } = useWindowSize()

  return (
    <Layout meta={{ ...meta.MAIN }}>
      <Container style={{ padding: (width ?? 820) < 850 ? 0 : '20px' }}>
        <CategoriesSlider />
      </Container>
      <Container>
        <BannersSlider banners={banners} />
        {offers?.map(({ _id }) => (
          <React.Fragment key={_id}>
            <OffersSlider id={_id} />
          </React.Fragment>
        ))}
      </Container>
    </Layout>
  )
}

export default HomePage
