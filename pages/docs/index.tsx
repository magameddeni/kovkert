import React, { useEffect, useState } from 'react'
import useSWR from 'swr'
import { useRouter } from 'next/router'
import { meta, routes } from '@/constants'
import { useWindowSize } from '@/hooks'
import { TDoc } from '@/models'
import { Breadcrumbs, Col, Container, DotsLoader, Row, Text } from '@/components/UI'
import { DocContent, DocNav } from '@/components/docsPage'
import Layout from '@/components/layout/Main'
import $api from '@/components/Http/axios'
import s from './docs-page.module.scss'

const fetcher = (url: string) => $api.get(url).then((res) => res.data)
const GET_ALL_DOCUMENTS_ROUTE = '/api/docs/getdocs'

const DocsPage = () => {
  const [activeLink, setActiveLink] = useState<string>('')
  const router = useRouter()
  const { to } = router.query
  const { isLarge } = useWindowSize()

  const { data } = useSWR<{ message: TDoc[] }, Error>(GET_ALL_DOCUMENTS_ROUTE, fetcher)

  useEffect(() => {
    if (to) return setActiveLink(to as string)
    setActiveLink('')
  }, [to])

  const findDocByLink = () => {
    if (!data) return
    return data.message.find((v: TDoc) => v.link === activeLink)
  }

  return (
    <Layout meta={{ ...meta.DOCS }}>
      <Container className={s.docs}>
        {!isLarge && activeLink && (
          <Breadcrumbs
            crumbs={[
              { _id: routes.DOCS, name: 'Справочный раздел' },
              { _id: router.asPath, name: findDocByLink()?.title ?? '' }
            ]}
            className='offset-sm-top-16'
            withIndexPageCrumb={false}
          />
        )}
        {(isLarge || (!isLarge && !activeLink)) && <Text as='h1'>Справочный раздел</Text>}
        {data ? (
          <Row className={!isLarge && activeLink ? 'offset-top-16' : 'offset-top-24'}>
            <Col className={s.docs__nav}>
              {(isLarge || (!isLarge && !activeLink)) && (
                <DocNav data={data?.message} active={activeLink} arrowRight={!isLarge} />
              )}
            </Col>
            <Col className={s.docs__content}>
              <DocContent data={findDocByLink()?.content} />
            </Col>
          </Row>
        ) : (
          <DotsLoader center />
        )}
      </Container>
    </Layout>
  )
}

export default DocsPage
