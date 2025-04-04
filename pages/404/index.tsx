import React from 'react'
import { meta } from '@/constants'
import Error404 from '@/components/404Page/404'
import Layout from '@/components/layout/Main'

const Page404 = () => (
  <Layout meta={{ ...meta.ERROR_PAGE() }}>
    <Error404 />
  </Layout>
)

export default Page404
