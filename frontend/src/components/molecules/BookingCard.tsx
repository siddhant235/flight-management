import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import {
    ClockIcon,
    ArrowLongRightIcon,
    TicketIcon,
    MapPinIcon,
    ExclamationCircleIcon
} from '@heroicons/react/24/outline';
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
            <Badge className="bg-red-100 text-red-600 px-2 py-0.5 flex items-center gap-1">
                <ExclamationCircleIcon className="h-3 w-3" />
                <span>Status Error</span>
            </Badge>
        );
    }

    const config = getStatusConfig(status);
    return (
        <Badge className={`${config.color} text-white px-2 py-0.5 ring-1 ${config.ringColor} ring-offset-1`}>
            <span className="mr-1">{config.icon}</span>
            {status}
        </Badge>
    );
};

export const BookingCard = ({ booking }: BookingCardProps) => {
    const router = useRouter();
    const { status, error } = useBookingStatus(booking.id, booking.booking_status);

    const handleClick = () => {
        router.push(`/bookings/${booking.id}`);
    };

    return (
        <Card
            className="w-full p-4 hover:shadow-lg transition-all duration-200 hover:scale-[1.01] cursor-pointer"
            onClick={handleClick}
        >
            {/* Header Section */}
            <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2 group">
                    <div className="p-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20">
                        <TicketIcon className="h-4 w-4 text-blue-500" />
                    </div>
                    <h2 className="text-base font-semibold group-hover:text-blue-500 transition-colors">
                        {booking.booking_reference}
                    </h2>
                </div>
                <BookingStatusBadge status={status} error={error} />
            </div>

            {/* Flight Details Section */}
            <div className="border-t border-gray-200 pt-3">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-100 dark:border-gray-700">
                    <div className="text-sm font-medium mb-2 flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 rounded text-blue-600 dark:text-blue-400">
                            {booking.flights.airline} - {booking.flights.flight_number}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm mb-2">
                        <div className="flex items-center gap-1">
                            <MapPinIcon className="h-3.5 w-3.5 text-gray-400" />
                            <span className="font-medium">{booking.flights.departure_airport}</span>
                        </div>
                        <ArrowLongRightIcon className="h-3.5 w-3.5 text-gray-400" />
                        <div className="flex items-center gap-1">
                            <MapPinIcon className="h-3.5 w-3.5 text-gray-400" />
                            <span className="font-medium">{booking.flights.arrival_airport}</span>
                        </div>
                    </div>
                    <div className="text-xs text-gray-500 flex items-center gap-1.5">
                        <ClockIcon className="h-3.5 w-3.5" />
                        {format(new Date(booking.departure_date + 'T' + booking.departure_time), 'PPp')}
                    </div>
                </div>
            </div>
        </Card>
    );
}; 