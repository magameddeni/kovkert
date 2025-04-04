import React from 'react'
import { useRouter } from 'next/router'
import { meta, routes } from '@/constants'
import { useAppSelector } from '@/redux/hook'
import { useWindowSize } from '@/hooks'
import { AppState } from '@/redux/store'
import { useLogoutUserMutation } from '@/redux/auth/authApi'
import { Container, DotsLoader, Text } from '@/components/UI'
import { ProfileTabValues } from '@/components/profile/types'
import { ProfileChat } from '@/components/profile/ProfileChat'
import Layout from '@/components/layout/Main'
import NotAuthorized from '@/components/auth/NotAuthorized'
import ProfileMenu from '@/components/profile/ProfileMenu'
import ProfileInfo from '@/components/profile/ProfileInfo'
import ProfileOrders from '@/components/profile/ProfileOrders'
import ProfileReviews from '@/components/profile/ProfileReviews'
import { ProfilePartner } from '@/components/profile/ProfilePartner'
import styles from './profile.module.scss'

const ProfilePage = () => {
  const router = useRouter()
  const { isLarge } = useWindowSize()
  const { tab = ProfileTabValues.ORDERS } = router.query as { tab: ProfileTabValues }

  const [logout, { isLoading }] = useLogoutUserMutation()
  const { isLoggedIn, data: authData } = useAppSelector(({ beru }: AppState) => beru.user)

  const handleLogout = async () => {
    try {
      await router.push(routes.MAIN)
      await logout().unwrap()
    } catch {
      /* empty */
    }
  }

  const handleSetTab = (value: ProfileTabValues) => {
    router.push({ query: { tab: value } }, undefined, { shallow: true })
  }

  if (isLoading) return <DotsLoader center />
  if (!isLoggedIn) return <NotAuthorized />

  return (
    <Layout meta={{ ...meta.PROFILE }}>
      <Container>
        {isLarge && (
          <>
            <Text as='h1'>Профиль</Text>
            <div className={styles.profile_info}>
              <div className={styles.profile_info__name}>
                {authData?.name ?? 'Гость'} {authData?.lastName}
              </div>
              <button className={styles.profile_info__logout} onClick={handleLogout}>
                Выйти
              </button>
            </div>
          </>
        )}
        <div className={styles.content}>
          <aside className={styles.content__left}>
            <ProfileMenu active={tab} onClick={handleSetTab} />
          </aside>
          {isLarge && (
            <div className={styles.content__right}>
              {tab === ProfileTabValues.CHAT && <ProfileChat />}
              {tab === ProfileTabValues.REVIEWS && <ProfileReviews />}
              {tab === ProfileTabValues.INFO && <ProfileInfo />}
              {tab === ProfileTabValues.ORDERS && <ProfileOrders />}
              {tab === ProfileTabValues.PARTNER && <ProfilePartner />}
            </div>
          )}
        </div>
      </Container>
    </Layout>
  )
}

export default ProfilePage
