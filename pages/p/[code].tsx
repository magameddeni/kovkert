import $api from '@/components/Http/axios'

function getIdFromQueryString(queryString: string): string | null {
  const urlParams = new URLSearchParams(queryString)
  return urlParams.get('id')
}

export const getServerSideProps = async (context: any) => {
  const { code } = context.query

  try {
    const { data } = await $api.get(`/api/short-link/${code}`)
    const productId = getIdFromQueryString(data.originalUrl)

    return {
      redirect: {
        destination: `/product/${productId}${data.originalUrl}`,
        permanent: false
      }
    }
  } catch (err) {
    return {
      redirect: {
        destination: `/404`,
        permanent: false
      }
    }
  }
}

const PartnerSlugPage = () => {}

export default PartnerSlugPage
