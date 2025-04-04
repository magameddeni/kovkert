import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type TAuthState = {
  token: string | null
}

const initialState: TAuthState = {
  token: null
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: () => {
      localStorage.removeItem('accessToken')
      return initialState
    },
    setToken: (state: TAuthState, action: PayloadAction<string>) => {
      localStorage.setItem('accessToken', action.payload)
      return { ...state, token: action.payload }
    }
  }
})

export const { logout, setToken } = authSlice.actions

export default authSlice.reducer
