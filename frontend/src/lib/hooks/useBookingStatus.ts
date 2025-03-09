import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';

export const useBookingStatus = (bookingId: string, initialStatus: string) => {
    const [status, setStatus] = useState(initialStatus);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let channel: RealtimeChannel;

        const subscribeToStatus = async () => {
            try {
                setIsLoading(true);
                const supabase = createClient();

                channel = supabase
                    .channel(`booking_status_${bookingId}`)
                    .on(
                        'postgres_changes',
                        {
                            event: 'UPDATE',
                            schema: 'public',
                            table: 'booking',
                            filter: `id=eq.${bookingId}`
                        },
                        (payload) => {
                            const newStatus = payload.new.booking_status;
                            setStatus(newStatus);
                        }
                    )
                    .subscribe((status) => {
                        if (status === 'SUBSCRIBED') {
                            setIsLoading(false);
                        }
                        if (status === 'CHANNEL_ERROR') {
                            setError(new Error('Failed to subscribe to booking updates'));
                        }
                    });
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Unknown error occurred'));
                setIsLoading(false);
            }
        };

        subscribeToStatus();

        return () => {
            if (channel) {
                channel.unsubscribe();
            }
        };
    }, [bookingId]);

    return { status, isLoading, error };
}; 