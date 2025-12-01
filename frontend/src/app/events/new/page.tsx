'use client';

import React from 'react';
import { Typography } from '@mui/material';
import { EventForm } from '../../../components/events/EventForm';
import { useCreateEventMutation } from '../../../store/eventApi';
import { useRouter } from 'next/navigation';

export default function NewEventPage() {
    const [createEvent, { isLoading }] = useCreateEventMutation();
    const router = useRouter();

    return (
        <>
            <Typography variant="h5" mb={2}>
                Create Event
            </Typography>
            <EventForm
                submitting={isLoading}
                onSubmit={async (values) => {
                    await createEvent({
                        title: values.title,
                        description: values.description ?? '',
                        date: new Date(values.date).toISOString(),
                        location: values.location,
                        category: values.category,
                        latitude: values.latitude ? Number(values.latitude) : undefined,
                        longitude: values.longitude ? Number(values.longitude) : undefined,
                    }).unwrap();
                    router.push('/events');
                }}
            />
        </>
    );
}
