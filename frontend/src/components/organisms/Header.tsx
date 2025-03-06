'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { signOut } from '@/lib/features/authSlice';
import { Button } from '../molecules/Button';
import type { RootState, AppDispatch } from '@/lib/store';

export const Header = () => {
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { user, isLoading } = useSelector((state: RootState) => state.auth);

    const handleSignOut = async () => {
        try {
            await dispatch(signOut()).unwrap();
            router.push('/');
        } catch (error) {
            console.error('Sign out error:', error);
        }
    };

    return (
        <header className="bg-white dark:bg-gray-800 shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
                        Flight Management
                    </Link>

                    <nav className="flex items-center space-x-4">
                        {isLoading ? (
                            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
                        ) : user ? (
                            <>
                                <Link
                                    href="/profile"
                                    className={`text-sm font-medium ${pathname === '/profile'
                                        ? 'text-blue-600 dark:text-blue-400'
                                        : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                                        }`}
                                >
                                    Profile
                                </Link>
                                <Button
                                    variant="secondary"
                                    onClick={handleSignOut}
                                    className="text-sm"
                                >
                                    Sign out
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className={`text-sm font-medium ${pathname === '/login'
                                        ? 'text-blue-600 dark:text-blue-400'
                                        : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                                        }`}
                                >
                                    Sign in
                                </Link>
                                <Link
                                    href="/signup"
                                    className={`text-sm font-medium ${pathname === '/signup'
                                        ? 'text-blue-600 dark:text-blue-400'
                                        : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                                        }`}
                                >
                                    Sign up
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
}; 