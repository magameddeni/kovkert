import React from 'react'
import { meta } from '@/constants'
import { Container } from '@/components/UI'
import Layout from '@/components/layout/Main'
import Info from '@/components/profile/ProfileInfo'

const ProfileInfo = () => (
  <Layout meta={{ ...meta.PROFILE_INFO }}>
    <Container>
      <Info />
    </Container>
  </Layout>
)

export default ProfileInfo
