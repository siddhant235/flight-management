import { Badge } from '@/components/atoms/Badge';

export const BookingStatusBadge = ({ status }: { status: string }) => {
    const getStatusConfig = (status: string) => {
        switch (status.toLowerCase()) {
            case 'confirmed':
                return { color: 'bg-green-500', icon: '✓', ringColor: 'ring-green-200' };
            case 'pending':
                return { color: 'bg-yellow-500', icon: '⌛', ringColor: 'ring-yellow-200' };
            case 'cancelled':
                return { color: 'bg-red-500', icon: '✕', ringColor: 'ring-red-200' };
            default:
                return { color: 'bg-gray-500', icon: '?', ringColor: 'gray-200' };
        }
    };

    const config = getStatusConfig(status);
    return (
        <Badge className={`${config.color} text-white px-3 py-1 ring-2 ${config.ringColor} ring-offset-2`}>
            <span className="mr-1">{config.icon}</span>
            {status}
        </Badge>
    );
}; 