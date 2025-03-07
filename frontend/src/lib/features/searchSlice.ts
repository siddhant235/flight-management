import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { FlightSearchFormData, TripType, SeatClassType } from '@/types/flight'
import { searchService } from '@/lib/services/searchService'
import type { RootState } from '@/lib/store'
import { flightApi } from '@/lib/services/flightApi'

interface SearchState {
    searchParams: FlightSearchFormData
    isSearching: boolean
    error: string | null
}

const initialState: SearchState = {
    searchParams: {
        tripType: TripType.ROUND_TRIP,
        origin: '',
        destination: '',
        departureDate: '',
        returnDate: '',
        seatClass: SeatClassType.ECONOMY,
        passengers: {
            adults: 1,
            children: 0,
            infants: 0,
        }
    },
    isSearching: false,
    error: null,
}

export const searchFlights = createAsyncThunk(
    'search/searchFlights',
    async (searchData: FlightSearchFormData, { dispatch }) => {
        // Validate the search data
        const dateError = searchService.validateDates(
            searchData.departureDate,
            searchData.tripType,
            searchData.returnDate
        )
        if (dateError) throw new Error(dateError)

        const passengerError = searchService.validatePassengers(
            searchData.passengers.adults,
            searchData.passengers.children,
            searchData.passengers.infants
        )
        if (passengerError) throw new Error(passengerError)

        // Call the API using RTK Query mutation
        const result = await dispatch(
            flightApi.endpoints.searchFlights.initiate(searchData)
        ).unwrap()

        return result
    }
)

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        updateSearchParams: (state, action: PayloadAction<Partial<FlightSearchFormData>>) => {
            // Deep merge for nested objects
            if (action.payload.passengers) {
                state.searchParams.passengers = {
                    ...state.searchParams.passengers,
                    ...action.payload.passengers
                }
            }

            // Update other fields
            if (action.payload.tripType) state.searchParams.tripType = action.payload.tripType
            if (action.payload.origin) state.searchParams.origin = action.payload.origin
            if (action.payload.destination) state.searchParams.destination = action.payload.destination
            if (action.payload.departureDate) state.searchParams.departureDate = action.payload.departureDate
            if (action.payload.returnDate) state.searchParams.returnDate = action.payload.returnDate
            if (action.payload.seatClass) state.searchParams.seatClass = action.payload.seatClass

            state.error = null
        },
        setSearchError: (state, action: PayloadAction<string>) => {
            state.error = action.payload
        },
        resetSearch: (state) => {
            state.searchParams = initialState.searchParams
            state.error = null
        },
        clearError: (state) => {
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(searchFlights.pending, (state) => {
                state.isSearching = true
                state.error = null
            })
            .addCase(searchFlights.fulfilled, (state) => {
                state.isSearching = false
            })
            .addCase(searchFlights.rejected, (state, action) => {
                state.isSearching = false
                state.error = action.error.message || 'An error occurred'
            })
    },
})

// Selectors
export const selectSearchParams = (state: RootState) => state.search.searchParams
export const selectIsSearching = (state: RootState) => state.search.isSearching
export const selectSearchError = (state: RootState) => state.search.error

export const { updateSearchParams, setSearchError, resetSearch, clearError } = searchSlice.actions
export default searchSlice.reducer
