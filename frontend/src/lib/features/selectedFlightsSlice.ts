import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Flight } from '@/types/flight';

interface SelectedFlightsState {
    outboundFlight: Flight | null;
    returnFlight: Flight | null;
}

const initialState: SelectedFlightsState = {
    outboundFlight: null,
    returnFlight: null,
};

export const selectedFlightsSlice = createSlice({
    name: 'selectedFlights',
    initialState,
    reducers: {
        setOutboundFlight: (state, action: PayloadAction<Flight | null>) => {
            state.outboundFlight = action.payload;
        },
        setReturnFlight: (state, action: PayloadAction<Flight | null>) => {
            state.returnFlight = action.payload;
        },
        clearSelectedFlights: (state) => {
            state.outboundFlight = null;
            state.returnFlight = null;
        },
    },
});

export const { setOutboundFlight, setReturnFlight, clearSelectedFlights } = selectedFlightsSlice.actions;
export default selectedFlightsSlice.reducer; 