'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getSession } from '@/lib/features/authSlice';
import type { AppDispatch } from '@/lib/store';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(getSession());
    }, [dispatch]);

    return <>{children}</>;
}; 