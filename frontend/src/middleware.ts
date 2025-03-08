import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { updateSession } from './lib/supabase/middleware';
// import { updateSession } from './lib/supabase/middleware';

// Define protected routes that need fresh session validation
const protectedRoutes = ['/profile', '/bookings', '/book']

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const supabase = await createClient()

    // Check for auth pages
    if (pathname === '/login' || pathname === '/signup') {
        const { data: { user } } = await supabase.auth.getUser()

        // Redirect to homepage if already logged in
        if (user) {
            return NextResponse.redirect(new URL('/', request.url))
        }
        return NextResponse.next()
    }

    // Check for protected routes
    if (protectedRoutes.some(route => pathname.startsWith(route))) {
        // First update the session to ensure Redux state is fresh
        const response = await updateSession(request)

        // Then check user status with updated session
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.redirect(new URL('/login', request.url))
        }

        // Add cache control headers to prevent stale data

        return response
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Exclude public routes:
         * - "/" (Homepage)
         * - "/api/flights" (Public API)
         * - "/api/airports" (Public API)
         * - "_next/static" (Static files)
         * - "_next/image" (Image optimization)
         * - "favicon.ico" (Favicon)
         * - Assets with common image extensions
         */
        '/((?!^$|^api/flights$|^api/airports$|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
