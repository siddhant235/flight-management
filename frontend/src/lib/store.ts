'use client'

import { configureStore } from '@reduxjs/toolkit'
import { baseApi } from './baseApi'
import searchReducer from './features/searchSlice'
import authReducer from './features/authSlice'

export const makeStore = () => {
    return configureStore({
        reducer: {
            [baseApi.reducerPath]: baseApi.reducer,
            search: searchReducer,
            auth: authReducer,
        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(baseApi.middleware),
    })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
