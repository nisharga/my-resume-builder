import { Platform } from 'react-native';
import apiSlice from './api-slice';


/**
 * TypeScript Interfaces
 */
export interface Notification {
    _id: string;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: string;
    data?: {
        type?: string;
        orderId?: string;
        [key: string]: any;
    };
}

interface RegisterTokenPayload {
    fcmToken: string;
    token: string;
    deviceToken: string;
    platform: string;
}

export const notificationApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        // 1. Register Token with Backend
        registerTokenWithBackend: builder.mutation<any, string>({
            query: (token) => ({
                url: '/auth/save-fcm-token',
                method: 'POST',
                body: {
                    fcmToken: token,
                    token: token,
                    deviceToken: token,
                    platform: Platform.OS,
                } as RegisterTokenPayload,
            }),
            // Using transformResponse to match your console.log(response.data) logic
            transformResponse: (response: any) => response?.data || response,
        }),

        // 2. Fetch Notifications
        fetchNotifications: builder.query<Notification[], void>({
            query: () => '/notifications/my-notifications',
            providesTags: ['notification'], // This ensures the list refreshes when one is marked read
            transformResponse: (response: any) => {
                // Matches your logic: check for success/data or if it's a direct array
                if (response?.success && Array.isArray(response?.data)) {
                    return response.data;
                } else if (Array.isArray(response)) {
                    return response;
                }
                return [];
            },
        }),

        // 3. Mark Notification as Read
        markAsRead: builder.mutation<boolean, string>({
            query: (notificationId) => ({
                url: `/notifications/${notificationId}/read`,
                method: 'PATCH',
            }),
            // This tells RTK Query to auto-refetch the notification list
            invalidatesTags: ['notification'],
            transformResponse: () => true,
            transformErrorResponse: (response) => {
                console.error('[Firebase] Mark as read error:', response);
                return false;
            }
        }),

    }),
});

// Export the auto-generated hooks for use in functional components
export const {
    useRegisterTokenWithBackendMutation,
    useFetchNotificationsQuery,
    useMarkAsReadMutation,
} = notificationApi;

// Export the "raw" trigger functions for use in non-component files (like Firebase service)
export const notificationEndpoints = notificationApi.endpoints;