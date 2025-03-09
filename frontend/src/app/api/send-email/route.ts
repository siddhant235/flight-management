import { NextRequest, NextResponse } from 'next/server';

// Validate environment variables at startup
if (!process.env.SENDGRID_API_KEY) {
    throw new Error('SENDGRID_API_KEY is not set in environment variables');
}

if (!process.env.FROM_EMAIL) {
    throw new Error('FROM_EMAIL is not set in environment variables');
}

export const runtime = 'edge'; // Use Edge Runtime for better performance

export async function POST(req: NextRequest) {
    try {
        // Parse request body
        const { to, subject, html } = await req.json();

        // Validate request body
        if (!to || !subject || !html) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Send email using SendGrid API
        const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                personalizations: [{
                    to: [{ email: to }],
                }],
                from: {
                    email: process.env.FROM_EMAIL,
                    name: process.env.FROM_NAME || 'Flight Booking System' // Optional sender name
                },
                subject,
                content: [{
                    type: 'text/html',
                    value: html,
                }],
            }),
        });

        // Handle SendGrid API response
        if (!response.ok) {
            const errorData = await response.json();
            console.error('SendGrid API error:', errorData);
            return NextResponse.json(
                { error: 'Failed to send email', details: errorData },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { success: true, message: 'Email sent successfully' },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json(
            {
                error: 'Internal server error',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
} 