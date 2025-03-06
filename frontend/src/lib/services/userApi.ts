import { baseApi, ApiEndpointBuilder } from '../baseApi';
import { ApiTagTypes } from '../constants/apiTags';
import type { User } from '@/types/user';

export const userApi = baseApi.injectEndpoints({
    endpoints: (builder: ApiEndpointBuilder) => ({
        getCurrentUser: builder.query<User, void>({
            query: () => 'user',
            providesTags: [ApiTagTypes.USER],
        }),
        updateUser: builder.mutation<User, Partial<User>>({
            query: (data) => ({
                url: 'user',
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: [ApiTagTypes.USER],
        }),
    }),
});

export const {
    useGetCurrentUserQuery,
    useUpdateUserMutation,
} = userApi; 