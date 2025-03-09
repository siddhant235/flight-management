import { format } from 'date-fns';
import { Card } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import {
    CalendarIcon,
    ClockIcon,
    UserGroupIcon,
    ArrowLongRightIcon,
    TicketIcon,
    BanknotesIcon,
    MapPinIcon,
    ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { formatCurrency } from '@/lib/utils/utils';
import { Booking } from '@/types/booking';
import { useBookingStatus } from '@/lib/hooks/useBookingStatus';

interface BookingCardProps {
    booking: Booking;
}

const BookingStatusBadge = ({ status, error }: { status: string; error?: Error | null }) => {
    const getStatusConfig = (status: string) => {
        switch (status.toLowerCase()) {
            case 'confirmed':
                return { color: 'bg-green-500', icon: '✓', ringColor: 'ring-green-200' };
            case 'pending':
                return { color: 'bg-yellow-500', icon: '⌛', ringColor: 'ring-yellow-200' };
            case 'cancelled':
                return { color: 'bg-red-500', icon: '✕', ringColor: 'ring-red-200' };
            default:
                return { color: 'bg-gray-500', icon: '?', ringColor: 'ring-gray-200' };
        }
    };

    if (error) {
        return (
            <Badge className="bg-red-100 text-red-600 px-3 py-1 flex items-center gap-1">
                <ExclamationCircleIcon className="h-4 w-4" />
                <span>Status Error</span>
            </Badge>
        );
    }

    const config = getStatusConfig(status);
    return (
        <Badge className={`${config.color} text-white px-3 py-1 ring-2 ${config.ringColor} ring-offset-2`}>
            <span className="mr-1">{config.icon}</span>
            {status}
        </Badge>
    );
};

export const BookingCard = ({ booking }: BookingCardProps) => {
    const { status, error } = useBookingStatus(booking.id, booking.booking_status);

    return (
        <Card className="w-full p-6 hover:shadow-lg transition-all duration-200 hover:scale-[1.01] cursor-pointer">
            {/* Header Section */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <div className="flex items-center gap-2 mb-2 group">
                        <div className="p-2 rounded-full bg-blue-50 dark:bg-blue-900/20">
                            <TicketIcon className="h-5 w-5 text-blue-500" />
                        </div>
                        <h2 className="text-lg font-semibold group-hover:text-blue-500 transition-colors">
                            {booking.booking_reference}
                        </h2>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <CalendarIcon className="h-4 w-4" />
                        <span>Booked on {format(new Date(booking.created_at), 'PPP')}</span>
                    </div>
                </div>
                <BookingStatusBadge status={status} error={error} />
            </div>

            {/* Flight Details Section */}
            <div className="border-t border-gray-200 pt-4">
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <h3 className="font-medium flex items-center gap-2">
                            <div className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-800">
                                <ClockIcon className="h-5 w-5 text-gray-500" />
                            </div>
                            Flight Details
                        </h3>
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
                            <div className="text-sm font-medium mb-3 flex items-center gap-2">
                                <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 rounded text-blue-600 dark:text-blue-400">
                                    {booking.flights.airline} - {booking.flights.flight_number}
                                </span>
                            </div>
                            <div className="flex items-center gap-3 text-sm mb-3">
                                <div className="flex items-center gap-1">
                                    <MapPinIcon className="h-4 w-4 text-gray-400" />
                                    <span className="font-medium">{booking.flights.departure_airport}</span>
                                </div>
                                <ArrowLongRightIcon className="h-4 w-4 text-gray-400" />
                                <div className="flex items-center gap-1">
                                    <MapPinIcon className="h-4 w-4 text-gray-400" />
                                    <span className="font-medium">{booking.flights.arrival_airport}</span>
                                </div>
                            </div>
                            <div className="text-sm text-gray-500 flex items-center gap-2">
                                <ClockIcon className="h-4 w-4" />
                                {format(new Date(booking.departure_date + 'T' + booking.departure_time), 'PPp')}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-medium flex items-center gap-2">
                            <div className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-800">
                                <UserGroupIcon className="h-5 w-5 text-gray-500" />
                            </div>
                            Passengers
                        </h3>
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700">
                            {booking.passengers.map((passenger) => (
                                <div
                                    key={passenger.id}
                                    className="flex justify-between items-center py-2 first:pt-0 last:pb-0"
                                >
                                    <span className="font-medium">
                                        {passenger.first_name} {passenger.last_name}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-sm text-gray-600 dark:text-gray-300">
                                            {passenger.seat_class}
                                        </span>
                                        {passenger.seat_number && (
                                            <span className="text-sm text-gray-500">
                                                Seat {passenger.seat_number}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Price Section */}
            <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex justify-end items-center gap-2">
                    <div className="p-1.5 rounded-full bg-green-50 dark:bg-green-900/20">
                        <BanknotesIcon className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="font-semibold text-lg text-green-600 dark:text-green-400">
                        {formatCurrency(booking.total_amount)}
                    </p>
                </div>
            </div>
        </Card>
    );
}; 