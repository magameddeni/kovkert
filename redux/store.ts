import { combineReducers, configureStore, ConfigureStoreOptions } from '@reduxjs/toolkit'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import { createWrapper } from 'next-redux-wrapper'
import storage from './storage'
import { rtkQueryErrorLogger } from './middlewares/errorLogger'
import authReducer from './auth/authSlice'
import userReducer from './user/userSlice'
import basketReducer from './basket/basketSlice'
import favoriteReducer from './favorite/favoritesSlice'
import productsReducer from './product/productsSlice'
import { authApi } from './auth/authApi'
import { userApi } from './user/userApi'
import { basketApi } from './basket/basketApi'
import { favoritesApi } from './favorite/favoritesApi'

const persistConfig = {
  key: 'root',
  storage
}

const reducers = {
  auth: authReducer,
  user: userReducer,
  basket: basketReducer,
  favorite: favoriteReducer,
  products: productsReducer
}

const combinedReducer = combineReducers<typeof reducers>(reducers)
const persistedReducer = persistReducer(persistConfig, combinedReducer)

export const makeStore = (options?: ConfigureStoreOptions['preloadedState'] | undefined) =>
  configureStore({
    reducer: {
      beru: persistedReducer,
      [basketApi.reducerPath]: basketApi.reducer,
      [authApi.reducerPath]: authApi.reducer,
      [userApi.reducerPath]: userApi.reducer,
      [favoritesApi.reducerPath]: favoritesApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
        }
      }).concat(
        rtkQueryErrorLogger,
        authApi.middleware,
        userApi.middleware,
        basketApi.middleware,
        favoritesApi.middleware
      ),
    ...options,
    devTools: true
  })

export const store = makeStore()
export const persistor = persistStore(store)

export type AppDispatch = typeof store.dispatch
export type AppStore = ReturnType<typeof makeStore>
export type AppState = ReturnType<typeof store.getState>

export const wrapper = createWrapper<AppStore>(makeStore)
