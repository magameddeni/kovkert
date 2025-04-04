import axios, { AxiosResponse } from 'axios'
import { store } from '@/redux/store'
import { setToken } from '@/redux/auth/authSlice'
import { authApi } from '@/redux/auth/authApi'

export const API_URL = process.env.NEXT_PUBLIC_SERVER

const $api = axios.create({
  withCredentials: true,
  baseURL: API_URL,
  maxContentLength: 20 * 1024 * 1024,
  maxBodyLength: 20 * 1024 * 1024
})

$api.interceptors.request.use((config: any) => {
  const { token } = store.getState().beru.auth

  config.headers.authorization = `Bearer ${token}`
  return config
})

$api.interceptors.response.use(
  (config: AxiosResponse) => config,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest?._isRetry) {
      try {
        originalRequest._isRetry = true

        const response = await $api.get('/api/auth/token/refresh', {
          withCredentials: true
        })

        store.dispatch(setToken(response.data?.accessToken))

        return await $api.request(originalRequest)
      } catch (err) {
        console.error(err)
      }
    }
    if (error.response && error.response.status === 403) {
      store.dispatch(authApi.endpoints.logoutUser.initiate())
      return
    }
    throw error
  }
)

export default $api
