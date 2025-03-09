/**
 * Format time from "HH:mm:ss" format to 24-hour format (e.g., "10:30")
 */
export const formatTime = (time: string) => {
    // Handle time-only format (HH:mm:ss)
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
};

/**
 * Format date from "DD/MM/YYYY" format to short format (e.g., "Mar 15")
 */
export const formatDate = (dateStr: string) => {
    const [day, month, year] = dateStr.split('/').map(num => parseInt(num, 10));
    const date = new Date(year, month - 1, day); // month is 0-based in Date constructor

    return date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short'
    });
};

/**
 * Calculate and format duration between two timestamps (e.g., "2h 30m")
 */
export const calculateDuration = (departureTime: string, arrivalTime: string) => {
    // Parse times in 24-hour format
    const [depHours, depMinutes] = departureTime.split(':').map(num => parseInt(num, 10));
    const [arrHours, arrMinutes] = arrivalTime.split(':').map(num => parseInt(num, 10));

    // Calculate total minutes for each time
    const depTotalMinutes = depHours * 60 + depMinutes;
    const arrTotalMinutes = arrHours * 60 + arrMinutes;

    // Calculate duration considering possible next day arrival
    let durationInMinutes = arrTotalMinutes - depTotalMinutes;
    if (durationInMinutes < 0) {
        durationInMinutes += 24 * 60; // Add 24 hours if arrival is next day
    }

    const hours = Math.floor(durationInMinutes / 60);
    const minutes = durationInMinutes % 60;

    return `${hours}h ${minutes}m`;
};

export const calculateArrivalDate = (departureDate: string, departureTime: string, arrivalTime: string): string => {
    // Convert departureDate into a Date object
    const departureDateTime = new Date(`${departureDate}T${departureTime}`);

    // Convert arrivalTime into a Date object (same date initially)
    const arrivalDateTime = new Date(`${departureDate}T${arrivalTime}`);

    // If arrival time is earlier than departure time, it means the flight crosses midnight
    if (arrivalDateTime < departureDateTime) {
        arrivalDateTime.setDate(arrivalDateTime.getDate() + 1); // Move to next day
    }

    // Format the date in YYYY-MM-DD format using local timezone
    const year = arrivalDateTime.getFullYear();
    const month = String(arrivalDateTime.getMonth() + 1).padStart(2, '0');
    const day = String(arrivalDateTime.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}
