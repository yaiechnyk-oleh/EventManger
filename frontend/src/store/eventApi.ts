import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Event {
    id: string;
    title: string;
    description?: string | null;
    date: string;
    location: string;
    category: string;
    latitude?: number | null;
    longitude?: number | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface PaginatedEvents {
    items: Event[];
    total: number;
    page: number;
    limit: number;
}

export const eventApi = createApi({
    reducerPath: 'eventApi',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/',
    }),
    tagTypes: ['Events', 'Event'],
    endpoints: (builder) => ({
        getEvents: builder.query<
            PaginatedEvents,
            { category?: string; dateFrom?: string; dateTo?: string; sortBy?: string; page?: number; limit?: number }
        >({
            query: (params) => ({
                url: 'events',
                params,
            }),
            providesTags: (result) =>
                result
                    ? [
                        ...result.items.map(({ id }) => ({ type: 'Event' as const, id })),
                        { type: 'Events', id: 'LIST' },
                    ]
                    : [{ type: 'Events', id: 'LIST' }],
        }),

        getEventById: builder.query<Event, string>({
            query: (id) => `events/${id}`,
            providesTags: (result, error, id) => [{ type: 'Event', id }],
        }),

        createEvent: builder.mutation<Event, Omit<Event, 'id' | 'createdAt' | 'updatedAt'>>({
            query: (body) => ({
                url: 'events',
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'Events', id: 'LIST' }],
        }),

        updateEvent: builder.mutation<Event, { id: string; data: Partial<Event> }>({
            query: ({ id, data }) => ({
                url: `events/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Event', id },
                { type: 'Events', id: 'LIST' },
            ],
        }),

        deleteEvent: builder.mutation<Event, string>({
            query: (id) => ({
                url: `events/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'Event', id },
                { type: 'Events', id: 'LIST' },
            ],
        }),

        getRecommendations: builder.query<Event[], string>({
            query: (id) => `events/${id}/recommendations`,
            providesTags: (result, error, id) => [{ type: 'Event', id: `${id}-recs` }],
        }),
    }),
});

export const {
    useGetEventsQuery,
    useGetEventByIdQuery,
    useCreateEventMutation,
    useUpdateEventMutation,
    useDeleteEventMutation,
    useGetRecommendationsQuery,
} = eventApi;
