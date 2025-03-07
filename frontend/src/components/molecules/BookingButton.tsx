import { Button } from '@/components/atoms/Button';
import { Text } from '@/components/atoms/Typography';
import { flightSelectionService } from '@/lib/services/flightSelectionService';

interface BookingButtonProps {
    onBook: () => void;
}

export function BookingButton({ onBook }: BookingButtonProps) {
    const totalPrice = flightSelectionService.calculateTotalPrice();
    const canProceed = flightSelectionService.canProceedToBooking();

    if (!canProceed) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-lg p-4 z-50">
            <div className="container mx-auto max-w-7xl flex justify-between items-center">
                <div>
                    <Text className="text-lg font-semibold">Total Price:</Text>
                    <Text className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        ${totalPrice.toFixed(2)}
                    </Text>
                </div>
                <Button onClick={onBook} disabled={!canProceed}>
                    Book Now
                </Button>
            </div>
        </div>
    );
} 