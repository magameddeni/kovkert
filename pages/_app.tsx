import React, { useEffect } from 'react'
import * as Sentry from '@sentry/nextjs'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { CookiesProvider } from 'react-cookie'
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { YMaps } from '@pbe/react-yandex-maps'
import { ToastContainer } from 'react-toastify'
import { persistor, store } from '@/redux/store'
import { getMyLocation } from '@/helpers'
import { RouterProgressProvider } from '@/components/providers'
import YandexMetrika from '@/components/YandexMetrika'
import 'react-toastify/dist/ReactToastify.min.css'
import '@/styles/globals.scss'

function App({ Component, pageProps, router }: any) {
  const queryClient = new QueryClient({
    mutationCache: new MutationCache({
      onError: (err, _variables, _context, mutation) => {
        Sentry.withScope((scope) => {
          scope.setContext('mutation', {
            mutationId: mutation.mutationId,
            variables: mutation.state.variables
          })
          if (mutation.options.mutationKey && typeof mutation.options.mutationKey === 'string') {
            scope.setFingerprint(Array.from(mutation.options.mutationKey))
          }
          Sentry.captureException(err)
        })
      }
    }),
    queryCache: new QueryCache({
      onError: (err, query) => {
        Sentry.withScope((scope) => {
          scope.setContext('query', { queryHash: query.queryHash })
          scope.setFingerprint([query.queryHash.replaceAll(/[0-9]/g, '0')])
          Sentry.captureException(err)
        })
      }
    })
  })

  const apikey = '1dc361aa-4db6-4596-8604-8d44cf601660'
  const analyticsEnabled = process.env.NODE_ENV === 'production'

  useEffect(() => {
    getMyLocation()
  }, [])

  return (
    <>
      <CookiesProvider>
        <QueryClientProvider client={queryClient}>
          <YMaps query={{ apikey }}>
            <Provider store={store}>
              <PersistGate persistor={persistor}>
                <RouterProgressProvider>
                  <Component {...pageProps} key={router.route} />
                  <ToastContainer />
                </RouterProgressProvider>
              </PersistGate>
            </Provider>
          </YMaps>
        </QueryClientProvider>
      </CookiesProvider>
      <YandexMetrika enabled={analyticsEnabled} />
    </>
  )
}

export default App
