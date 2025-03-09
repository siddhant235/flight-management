import { Card } from '@/components/atoms/Card';
import { Skeleton } from '@/components/atoms/Skeleton';

export default function BookingsLoading() {
    console.log('BookingsLoading');
    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="w-full p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="space-y-2">
                                <Skeleton className="h-6 w-48" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                            <Skeleton className="h-6 w-24" />
                        </div>

                        <div className="border-t border-gray-200 pt-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <Skeleton className="h-5 w-24 mb-3" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-40" />
                                        <Skeleton className="h-4 w-36" />
                                        <Skeleton className="h-4 w-32" />
                                    </div>
                                </div>
                                <div>
                                    <Skeleton className="h-5 w-24 mb-3" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-48" />
                                        <Skeleton className="h-4 w-44" />
                                        <Skeleton className="h-4 w-40" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <Skeleton className="h-5 w-32 ml-auto" />
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
} 