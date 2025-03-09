import { format } from 'date-fns';

interface FlightDetails {
    flightId: string;
    airlineName: string;
    airlineId: string;
    departureDate: string;
    arrivalDate: string;
    departureTime: string;
    arrivalTime: string;
    origin: string;
    destination: string;
    seatClass: string;
    seatNumber: string;
}

interface PassengerDetails {
    firstName: string;
    lastName: string;
    email: string;
}

interface ETicketData {
    bookingReference: string;
    passenger: PassengerDetails;
    flights: FlightDetails[];
    totalAmount: number;
}

export function generateETicketHTML(data: ETicketData): string {
    const { bookingReference, passenger, flights, totalAmount } = data;

    const flightDetailsHTML = flights.map((flight) => `
        <div style="margin-bottom: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
            <h3 style="color: #2c3e50; margin-bottom: 15px;">${flight.origin} ✈ ${flight.destination}</h3>
            <div style="margin-bottom: 10px;">
                <p style="margin: 5px 0;"><strong>Airline:</strong> ${flight.airlineName}</p>
                <p style="margin: 5px 0;"><strong>Flight Number:</strong> ${flight.airlineId}-${flight.flightId}</p>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <div>
                    <p style="margin: 5px 0;"><strong>From:</strong> ${flight.origin}</p>
                    <p style="margin: 5px 0;"><strong>Date:</strong> ${format(new Date(flight.departureDate), 'dd MMM yyyy')}</p>
                    <p style="margin: 5px 0;"><strong>Time:</strong> ${flight.departureTime}</p>
                </div>
                <div>
                    <p style="margin: 5px 0;"><strong>To:</strong> ${flight.destination}</p>
                    <p style="margin: 5px 0;"><strong>Date:</strong> ${format(new Date(flight.arrivalDate), 'dd MMM yyyy')}</p>
                    <p style="margin: 5px 0;"><strong>Time:</strong> ${flight.arrivalTime}</p>
                </div>
            </div>
            <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #dee2e6;">
                <p style="margin: 5px 0;"><strong>Seat:</strong> ${flight.seatNumber} (${flight.seatClass})</p>
            </div>
        </div>
    `).join('');

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>E-Ticket - Booking Reference: ${bookingReference}</title>
            <style>
                @media print {
                    body {
                        print-color-adjust: exact;
                        -webkit-print-color-adjust: exact;
                    }
                }
            </style>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px; background-color: #2c3e50; color: white; padding: 20px; border-radius: 5px;">
                <h1 style="margin: 0;">Flight E-Ticket</h1>
                <p style="font-size: 18px; margin: 10px 0 0 0;">Booking Reference: ${bookingReference}</p>
            </div>

            <div style="margin-bottom: 30px; padding: 20px; background-color: #e8f4f8; border-radius: 5px;">
                <h2 style="color: #2c3e50; margin-bottom: 15px;">Passenger Information</h2>
                <p style="margin: 5px 0;"><strong>Name:</strong> ${passenger.firstName} ${passenger.lastName}</p>
                <p style="margin: 5px 0;"><strong>Email:</strong> ${passenger.email}</p>
            </div>

            <div style="margin-bottom: 30px;">
                <h2 style="color: #2c3e50; margin-bottom: 15px;">Flight Details</h2>
                ${flightDetailsHTML}
            </div>

            <div style="margin-top: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 5px;">
                <p style="margin: 5px 0; font-size: 18px;"><strong>Total Amount Paid:</strong> ₹${totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
            </div>

            <div style="margin-top: 30px; font-size: 14px; color: #7f8c8d; text-align: center;">
                <p>Thank you for choosing our service. Have a great flight!</p>
                <p>Please keep this e-ticket for your records.</p>
                <p>For any assistance, please contact our customer support.</p>
            </div>
        </body>
        </html>
    `;
} 