'use client';

import React, { useState } from 'react';
import { Box, Button, MenuItem, TextField } from '@mui/material';

type EventFormValues = {
    title: string;
    description?: string;
    date: string;
    location: string;
    category: string;
    latitude?: number;
    longitude?: number;
};

interface Props {
    initial?: Partial<EventFormValues>;
    onSubmit: (values: EventFormValues) => void;
    submitting?: boolean;
}

export const EventForm: React.FC<Props> = ({ initial, onSubmit, submitting }) => {
    const [values, setValues] = useState<EventFormValues>(() => ({
        title: initial?.title ?? '',
        description: initial?.description ?? '',
        date: initial?.date ?? '',
        location: initial?.location ?? '',
        category: initial?.category ?? '',
        latitude: initial?.latitude,
        longitude: initial?.longitude,
    }));

    const handleChange =
        (field: keyof EventFormValues) =>
            (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                setValues((prev) => ({ ...prev, [field]: e.target.value }));
            };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(values);
    };

    return (
        <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={2}>
            <TextField
                label="Title"
                required
                value={values.title}
                onChange={handleChange('title')}
            />
            <TextField
                label="Description"
                multiline
                minRows={3}
                value={values.description ?? ''}
                onChange={handleChange('description')}
            />
            <TextField
                label="Date & Time"
                type="datetime-local"
                required
                value={values.date ? values.date.slice(0, 16) : ''}
                onChange={handleChange('date')}
                InputLabelProps={{ shrink: true }}
            />
            <TextField
                label="Location"
                required
                value={values.location}
                onChange={handleChange('location')}
            />
            <TextField
                select
                label="Category"
                required
                value={values.category}
                onChange={handleChange('category')}
            >
                <MenuItem value="Tech">Tech</MenuItem>
                <MenuItem value="Music">Music</MenuItem>
                <MenuItem value="Sport">Sport</MenuItem>
            </TextField>

            <TextField
                label="Latitude"
                type="number"
                value={values.latitude ?? ''}
                onChange={handleChange('latitude')}
            />
            <TextField
                label="Longitude"
                type="number"
                value={values.longitude ?? ''}
                onChange={handleChange('longitude')}
            />

            <Box display="flex" justifyContent="flex-end" gap={2}>
                <Button type="submit" variant="contained" disabled={submitting}>
                    Save
                </Button>
            </Box>
        </Box>
    );
};
