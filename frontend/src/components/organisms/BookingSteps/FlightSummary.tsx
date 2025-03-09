import type { Flight } from '@/types/flight'
import type { FlightSearchFormData } from '@/types/flight'
import { CURRENCY } from '@/lib/constants/currency'

interface FlightSummaryProps {
    flights: Flight
    returnFlight?: Flight
    searchFormData: FlightSearchFormData
    passengerCount: number
}

export function FlightSummary({ flights, returnFlight, searchFormData, passengerCount }: FlightSummaryProps) {
    return (
        <>
            <div className="border rounded-lg p-4 space-y-2">
                <h2 className="text-xl font-semibold">Outbound Flight</h2>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium">{flights.airline} - {flights.flightNumber}</p>
                        <p className="text-sm text-gray-500">{flights.departureTime} - {flights.arrivalTime}</p>
                        <p className="text-sm text-gray-500">Date: {searchFormData.departureDate}</p>
                        <p className="text-sm text-gray-500">Class: {searchFormData.seatClass}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500">Per passenger</p>
                        <p className="font-medium">
                            {CURRENCY.symbol}{flights.price.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500">Total for {passengerCount} passengers</p>
                        <p className="font-bold text-lg">
                            {CURRENCY.symbol}{(flights.price * passengerCount).toFixed(2)}
                        </p>
                    </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <p><span className="font-medium">From:</span> {flights.departureAirport}</p>
                    <p><span className="font-medium">To:</span> {flights.arrivalAirport}</p>
                </div>
            </div>

            {returnFlight && (
                <div className="border rounded-lg p-4 space-y-2">
                    <h2 className="text-xl font-semibold">Return Flight</h2>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium">{returnFlight.airline} - {returnFlight.flightNumber}</p>
                            <p className="text-sm text-gray-500">{returnFlight.departureTime} - {returnFlight.arrivalTime}</p>
                            <p className="text-sm text-gray-500">Date: {searchFormData.returnDate}</p>
                            <p className="text-sm text-gray-500">Class: {searchFormData.seatClass}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Per passenger</p>
                            <p className="font-medium">
                                {CURRENCY.symbol}{returnFlight.price.toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-500">Total for {passengerCount} passengers</p>
                            <p className="font-bold text-lg">
                                {CURRENCY.symbol}{(returnFlight.price * passengerCount).toFixed(2)}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <p><span className="font-medium">From:</span> {returnFlight.departureAirport}</p>
                        <p><span className="font-medium">To:</span> {returnFlight.arrivalAirport}</p>
                    </div>
                </div>
            )}

            <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-lg font-semibold">Grand Total</p>
                        <p className="text-sm text-gray-500">For {passengerCount} passengers</p>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">
                        {CURRENCY.symbol}{((flights.price + (returnFlight ? returnFlight.price : 0)) * passengerCount).toFixed(2)}
                    </p>
                </div>
            </div>
        </>
    )
} 