import { baseApi, ApiEndpointBuilder } from '../baseApi';
import { ApiTagTypes } from '../constants/apiTags';
import type { Profile, UpdateProfileData } from '@/types/profile';
import type { PaymentMethod } from '@/types/payment';

export const profileApi = baseApi.injectEndpoints({
    endpoints: (builder: ApiEndpointBuilder) => ({
        getProfile: builder.query<Profile, void>({
            query: () => 'api/profile',
            providesTags: [ApiTagTypes.PROFILE],
        }),
        updateProfile: builder.mutation<Profile, UpdateProfileData>({
            query: (data) => ({
                url: 'api/profile',
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: [ApiTagTypes.PROFILE],
        }),
        addPaymentMethod: builder.mutation<PaymentMethod, Omit<PaymentMethod, 'id' | 'user_id' | 'created_at' | 'updated_at'>>({
            query: (data) => ({
                url: 'api/payment-methods',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: [ApiTagTypes.PROFILE],
        }),
        deletePaymentMethod: builder.mutation<void, string>({
            query: (id) => ({
                url: 'api/payment-methods',
                method: 'DELETE',
                body: { id },
            }),
            invalidatesTags: [ApiTagTypes.PROFILE],
        }),
        setDefaultPaymentMethod: builder.mutation<void, { id: string; is_default: boolean }>({
            query: (data) => ({
                url: 'api/payment-methods',
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: [ApiTagTypes.PROFILE],
        }),
    }),
});

export const {
    useGetProfileQuery,
    useUpdateProfileMutation,
    useAddPaymentMethodMutation,
    useDeletePaymentMethodMutation,
    useSetDefaultPaymentMethodMutation,
} = profileApi; 