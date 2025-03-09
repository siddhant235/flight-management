export type SeatClass = 'ECONOMY' | 'BUSINESS' | 'FIRST_CLASS' | 'PREMIUM_ECONOMY';

export const formatSeatClassForDisplay = (seatClass: SeatClass): string => {
    switch (seatClass) {
        case 'FIRST_CLASS':
            return 'First Class';
        case 'PREMIUM_ECONOMY':
            return 'Premium Economy';
        default:
            return seatClass.charAt(0) + seatClass.slice(1).toLowerCase();
    }
};

export const formatSeatClassForDB = (seatClass: string): SeatClass => {
    // Convert "Premium Economy" or "premium economy" to "PREMIUM_ECONOMY"
    const normalized = seatClass.toUpperCase().trim();

    switch (normalized) {
        case 'PREMIUM ECONOMY':
            return 'PREMIUM_ECONOMY';
        case 'FIRST CLASS':
            return 'FIRST_CLASS';
        case 'BUSINESS':
            return 'BUSINESS';
        case 'ECONOMY':
            return 'ECONOMY';
        default:
            throw new Error(`Invalid seat class: ${seatClass}`);
    }
}; 