import React from 'react'
import { InferGetServerSidePropsType } from 'next'
import { meta } from '@/constants'
import { TCategory } from '@/models'
import { useWindowSize } from '@/hooks'
import { Col, Container, Row, Text } from '@/components/UI'
import Layout from '@/components/layout/Main'
import CategoryItem from '@/components/category/CategoryItem'
import $api from '@/components/Http/axios'
import s from './category-page.module.scss'

export const getServerSideProps = async () => {
  const { data } = await $api.get('/api/categories')

  return {
    props: {
      categories: data.categories
    }
  }
}

export default function CategoryPage({ categories }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { isLarge } = useWindowSize()

  if (!categories) return null

  return (
    <Layout meta={{ ...meta.CATEGORY }}>
      <Container className={s.category}>
        <Text as='h1'>Каталог</Text>
        <Row row={!isLarge ? 16 : 20} small={!isLarge} className='offset-top-16 offset-lg-top-24'>
          {categories.map((v: TCategory) => (
            <Col key={v._id} xs={4} sm={3} className={s['category-item-wrapper']}>
              <CategoryItem category={v} mainCategories={isLarge} />
            </Col>
          ))}
        </Row>
      </Container>
    </Layout>
  )
}
