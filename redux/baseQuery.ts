import { BaseQueryFn, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react'
import { Mutex } from 'async-mutex'
import { AppState } from './store'
import { setToken } from './auth/authSlice'
import { authApi } from './auth/authApi'

const API: any = process.env.NEXT_PUBLIC_SERVER
const BASE_ROUTE = '/'
const BASE_URL = API.concat(BASE_ROUTE)

const mutex = new Mutex()

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    headers.set('Accept', 'application/json')
    headers.set('Cache-Control', 'no-cache')
    headers.set('Pragma', 'no-cache')
    headers.set('Expires', '0')
    const store = getState() as unknown as AppState
    const { token } = store.beru.auth

    if (token !== undefined && token !== null) {
      headers.set('authorization', `Bearer ${token}`)
    }
    return headers
  }
})

export const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  // какой то мутекс чтоб запрос на рефреш не повторялся
  // ждем пока разблочит запрос

  await mutex.waitForUnlock()

  let result = await baseQuery(args, api, extraOptions)

  if (result.error && 'originalStatus' in result.error && result.error.originalStatus === 401) {
    // get a new token
    if (!mutex.isLocked()) {
      const release = await mutex.acquire()
      try {
        const refreshResult = await baseQuery('/api/auth/token/refresh', api, extraOptions)

        if (refreshResult?.data) {
          api.dispatch(setToken(refreshResult.data as string))
          result = await baseQuery(args, api, extraOptions)
        } else {
          api.dispatch(authApi.endpoints.logoutUser.initiate())
        }
      } finally {
        release()
      }
    } else {
      await mutex.waitForUnlock()
      result = await baseQuery(args, api, extraOptions)
    }
  }

  return result
}
