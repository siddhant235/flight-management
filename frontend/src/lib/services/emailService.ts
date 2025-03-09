import { SupabaseClient } from '@supabase/supabase-js';

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}

interface SendEmailParams {
    to: string;
    subject: string;
    html: string;
}

export async function sendEmail(supabase: SupabaseClient, options: EmailOptions): Promise<void> {
    const { data, error } = await supabase.functions.invoke('send-email', {
        body: {
            to: options.to,
            subject: options.subject,
            html: options.html,
        },
    });

    if (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }

    return data;
}

export async function sendBookingConfirmationEmail({ to, subject, html }: SendEmailParams) {
    try {
        const response = await fetch('/api/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to,
                subject,
                html,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to send email');
        }

        return await response.json();
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
} 