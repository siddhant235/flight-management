import { format } from 'date-fns';
import { Card } from '@/components/atoms/Card';
import {
    ClockIcon,
    UserGroupIcon,
    TicketIcon,
    BanknotesIcon,
} from '@heroicons/react/24/outline';
import { formatCurrency } from '@/lib/utils/utils';
import type { Booking } from '@/types/booking';
import { BookingStatusBadge } from '@/components/molecules/BookingStatus';

const SectionHeader = ({ icon: Icon, title }: { icon: React.ElementType; title: string }) => (
    <h3 className="font-medium flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-800">
            <Icon className="h-5 w-5 text-gray-500" />
        </div>
        {title}
    </h3>
);

export const BookingHeader = ({ reference, status }: { reference: string; status: string }) => (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
            <h1 className="text-2xl font-bold mb-2">Booking Details</h1>
            <div className="flex items-center gap-2 text-gray-500">
                <TicketIcon className="h-5 w-5" />
                <span className="font-medium">{reference}</span>
            </div>
        </div>
        <div className="sm:self-start">
            <BookingStatusBadge status={status} />
        </div>
    </div>
);

export const FlightDetails = ({ booking }: { booking: Booking }) => (
    <Card className="p-2">
        <SectionHeader icon={ClockIcon} title="Flight Details" />
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            {/* Flight Number and Airline */}
            <div className="mb-6">
                <div className="inline-flex items-center px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <span className="text-blue-600 dark:text-blue-400 font-medium">
                        {booking.flights.airline} - {booking.flights.flight_number}
                    </span>
                </div>
            </div>

            {/* Flight Route */}
            <div className="relative flex items-start gap-8 pb-8">
                {/* Departure */}
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500 ring-4 ring-blue-50 dark:ring-blue-900/20" />
                        <span className="text-sm font-medium text-gray-500">Departure</span>
                    </div>
                    <div className="space-y-1">
                        <div className="font-semibold text-lg">
                            {booking.flights.departure_airport}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            {format(new Date(booking.departure_date + 'T' + booking.departure_time), 'PPP')}
                        </div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {format(new Date(booking.departure_date + 'T' + booking.departure_time), 'p')}
                        </div>
                    </div>
                </div>



                {/* Arrival */}
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 rounded-full bg-green-500 ring-4 ring-green-50 dark:ring-green-900/20" />
                        <span className="text-sm font-medium text-gray-500">Arrival</span>
                    </div>
                    <div className="space-y-1">
                        <div className="font-semibold text-lg">
                            {booking.flights.arrival_airport}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            {format(new Date(booking.arrival_date + 'T' + booking.arrival_time), 'PPP')}
                        </div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {format(new Date(booking.arrival_date + 'T' + booking.arrival_time), 'p')}
                        </div>
                    </div>
                </div>
            </div>

            {/* Flight Info */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div>
                    <div className="text-sm text-gray-500 mb-1">Flight Duration</div>
                    <div className="font-medium">
                        {/* Calculate duration if needed */}
                        2h 30m
                    </div>
                </div>
                <div>
                    <div className="text-sm text-gray-500 mb-1">Class</div>
                    <div className="font-medium capitalize">
                        {booking.passengers[0]?.seat_class.toLowerCase().replace('_', ' ')}
                    </div>
                </div>
                <div>
                    <div className="text-sm text-gray-500 mb-1">Passengers</div>
                    <div className="font-medium">{booking.passengers.length} passenger(s)</div>
                </div>
            </div>
        </div>
    </Card>
);

export const PassengerDetails = ({ passengers }: { passengers: Booking['passengers'] }) => (
    <Card className="p-3">
        <SectionHeader icon={UserGroupIcon} title="Passenger Details" />
        <div className="divide-y divide-gray-200">
            {passengers.map((passenger) => (
                <div key={passenger.id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="font-medium">
                                {passenger.first_name} {passenger.last_name}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                                <div>Email: {passenger.email}</div>
                                <div>Phone: {passenger.phone}</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm">
                                {passenger.seat_class}
                            </div>
                            {passenger.seat_number && (
                                <div className="text-sm text-gray-500 mt-1">
                                    Seat {passenger.seat_number}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    </Card>
);

export const PaymentDetails = ({ amount, date }: { amount: number; date: string }) => (
    <Card className="p-3">
        <SectionHeader icon={BanknotesIcon} title="Payment Details" />
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex justify-between items-center">
                <div>
                    <div className="text-sm text-gray-500">Total Amount</div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {formatCurrency(amount)}
                    </div>
                </div>
                <div className="text-sm text-gray-500">
                    Booked on {format(new Date(date), 'PPP')}
                </div>
            </div>
        </div>
    </Card>
); 