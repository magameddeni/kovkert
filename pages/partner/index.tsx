import Layout from '@/components/layout/Main'
import { DetailedTable } from '@/components/profile/ProfilePartner/parts/DetailedTable'
import { meta } from '@/constants'
import React from 'react'
import s from './styles.module.scss'

const PartnerPage = () => (
  <Layout meta={{ ...meta.PARTNER }} className={s.PartnerPage}>
    <DetailedTable />
  </Layout>
)

export default PartnerPage
