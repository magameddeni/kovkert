import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IUser } from '@/models'

export type IUserState = {
  data: IUser | null
  isLoggedIn: boolean
  searchHistoryLocal: Array<string>
}

const initialState: IUserState = {
  data: null,
  isLoggedIn: false,
  searchHistoryLocal: []
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUser: () => initialState,
    setUser: (state: IUserState, action: PayloadAction<IUser>) => {
      state.data = action.payload
      state.isLoggedIn = true
    },
    setSearchHistoryLocal: (state: IUserState, action: PayloadAction<string>) => {
      if (!state.searchHistoryLocal.includes(action.payload.trim())) {
        state.searchHistoryLocal = [action.payload, ...state.searchHistoryLocal].slice(0, 5)
      }
    },
    removeSearchHistoryItemLocal: (state: IUserState, action: PayloadAction<string>) => {
      state.searchHistoryLocal = state.searchHistoryLocal.filter((v: string) => v !== action.payload)
    },
    clearSearchHistoryLocal: (state: IUserState) => {
      state.searchHistoryLocal = []
    }
  }
})

export const { setUser, clearUser, setSearchHistoryLocal, removeSearchHistoryItemLocal, clearSearchHistoryLocal } =
  userSlice.actions

export default userSlice.reducer
