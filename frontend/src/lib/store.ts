'use client'

import { configureStore } from '@reduxjs/toolkit'
import { baseApi } from './baseApi'
import searchReducer from './features/searchSlice'
import authReducer from './features/authSlice'
import selectedFlightsReducer from './features/selectedFlightsSlice'

export const makeStore = () => {
    return configureStore({
        reducer: {
            [baseApi.reducerPath]: baseApi.reducer,
            search: searchReducer,
            auth: authReducer,
            selectedFlights: selectedFlightsReducer,
        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(baseApi.middleware),
    })
}

export const store = makeStore()

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
