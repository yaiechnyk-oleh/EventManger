'use client';

import React from 'react';
import { Typography, CircularProgress } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { EventForm } from '@/components/events/EventForm';
import { useGetEventByIdQuery, useUpdateEventMutation } from '@/store/eventApi';

export default function EditEventPage() {
    const params = useParams();
    const id = params?.id as string;
    const { data, isLoading } = useGetEventByIdQuery(id);
    const [updateEvent, { isLoading: isSaving }] = useUpdateEventMutation();
    const router = useRouter();

    if (isLoading || !data) return <CircularProgress />;

    return (
        <>
            <Typography variant="h5" mb={2}>
                Edit Event
            </Typography>
            <EventForm
                initial={{
                    title: data.title,
                    description: data.description ?? '',
                    date: data.date,
                    location: data.location,
                    category: data.category,
                }}
                submitting={isSaving}
                onSubmit={async (values) => {
                    await updateEvent({
                        id,
                        data: {
                            title: values.title,
                            description: values.description ?? '',
                            date: values.date
                                ? new Date(values.date).toISOString()
                                : data.date,
                            location: values.location,
                            category: values.category,
                            latitude: values.latitude ? Number(values.latitude) : data.latitude,
                            longitude: values.longitude ? Number(values.longitude) : data.longitude,
                        },
                    }).unwrap();
                    router.push(`/events/${id}`);
                }}
            />
        </>
    );
}
