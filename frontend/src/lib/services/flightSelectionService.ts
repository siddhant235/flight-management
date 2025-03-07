import type { Flight } from '@/types/flight';
import { store } from '../store';
import { setOutboundFlight, setReturnFlight, clearSelectedFlights } from '../features/selectedFlightsSlice';

export const flightSelectionService = {
    selectOutboundFlight: (flight: Flight) => {
        store.dispatch(setOutboundFlight(flight));
    },

    selectReturnFlight: (flight: Flight) => {
        store.dispatch(setReturnFlight(flight));
    },

    clearSelection: () => {
        store.dispatch(clearSelectedFlights());
    },

    getSelectedFlights: () => {
        const state = store.getState();
        return {
            outboundFlight: state.selectedFlights.outboundFlight,
            returnFlight: state.selectedFlights.returnFlight,
        };
    },

    calculateTotalPrice: () => {
        const { outboundFlight, returnFlight } = flightSelectionService.getSelectedFlights();
        let total = 0;

        if (outboundFlight) {
            total += outboundFlight.price;
        }
        if (returnFlight) {
            total += returnFlight.price;
        }

        return total;
    },

    canProceedToBooking: () => {
        const { outboundFlight } = flightSelectionService.getSelectedFlights();
        return !!outboundFlight;
    },
}; 