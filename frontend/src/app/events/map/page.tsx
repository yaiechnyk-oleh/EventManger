'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import {
    Box,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Typography,
} from '@mui/material';
import { useGetEventsQuery } from '@/store/eventApi';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setCategoryFilter } from '@/store/uiSlice';

const EventsMap = dynamic(
    () => import('../../../components/events/EventsMap').then((m) => m.EventsMap),
    {
        ssr: false,
        loading: () => <CircularProgress />,
    },
);

export default function EventsMapPage() {
    const dispatch = useAppDispatch();
    const { categoryFilter } = useAppSelector((s) => s.ui);

    const { data, isLoading, error } = useGetEventsQuery({
        category: categoryFilter,
        limit: 100,
    });

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" mb={2} alignItems="center">
                <Typography variant="h5">Events Map</Typography>

                <FormControl size="small" sx={{ minWidth: 160 }}>
                    <InputLabel>Category</InputLabel>
                    <Select
                        label="Category"
                        value={categoryFilter ?? ''}
                        onChange={(e) =>
                            dispatch(setCategoryFilter(e.target.value || undefined))
                        }
                    >
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="Tech">Tech</MenuItem>
                        <MenuItem value="Music">Music</MenuItem>
                        <MenuItem value="Sport">Sport</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {isLoading && <CircularProgress />}

            {error && (
                <Typography color="error" mt={2}>
                    Failed to load events for map
                </Typography>
            )}

            {data && <EventsMap events={data.items} />}
        </Box>
    );
}
