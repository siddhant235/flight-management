// Import types for Edge Function
import { NextRequest } from 'next/server'

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || ''
const FROM_EMAIL = process.env.FROM_EMAIL || ''

interface EmailRequest {
    to: string
    subject: string
    html: string
}

export default async function handler(req: NextRequest) {
    try {
        // Get request body
        const { to, subject, html } = await req.json() as EmailRequest

        // Validate request
        if (!to || !subject || !html) {
            return new Response(
                JSON.stringify({ error: 'Missing required fields' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            )
        }

        // Validate API key and sender email
        if (!SENDGRID_API_KEY || !FROM_EMAIL) {
            throw new Error('SendGrid configuration missing')
        }

        // Send email using SendGrid API directly
        const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${SENDGRID_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                personalizations: [{
                    to: [{ email: to }]
                }],
                from: { email: FROM_EMAIL },
                subject: subject,
                content: [{
                    type: 'text/html',
                    value: html
                }]
            })
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(`SendGrid API error: ${JSON.stringify(errorData)}`)
        }

        return new Response(
            JSON.stringify({ message: 'Email sent successfully' }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        )

    } catch (error) {
        console.error('Error sending email:', error)
        return new Response(
            JSON.stringify({
                error: 'Failed to send email',
                details: error instanceof Error ? error.message : 'Unknown error'
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
    }
} 