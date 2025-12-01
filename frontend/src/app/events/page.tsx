'use client';

import React from 'react';
import { useGetEventsQuery } from '@/store/eventApi';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setSortBy, setCategoryFilter } from '@/store/uiSlice';
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    CircularProgress,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Typography,
} from '@mui/material';
import Link from 'next/link';

export default function EventsPage() {
    const dispatch = useAppDispatch();
    const { sortBy, categoryFilter } = useAppSelector((s) => s.ui);

    const { data, isLoading, error } = useGetEventsQuery({
        sortBy,
        category: categoryFilter,
    });

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" mb={2}>
                <Box display="flex" gap={2}>
                    <FormControl size="small">
                        <InputLabel>Sort By</InputLabel>
                        <Select
                            label="Sort By"
                            value={sortBy}
                            onChange={(e) => dispatch(setSortBy(e.target.value as any))}
                        >
                            <MenuItem value="dateAsc">Date ↑</MenuItem>
                            <MenuItem value="dateDesc">Date ↓</MenuItem>
                            <MenuItem value="titleAsc">Title A-Z</MenuItem>
                            <MenuItem value="titleDesc">Title Z-A</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl size="small">
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

                <Button variant="contained" component={Link} href="/events/new">
                    Create Event
                </Button>
            </Box>

            {isLoading && <CircularProgress />}

            {error && (
                <Typography color="error" mt={2}>
                    Failed to load events
                </Typography>
            )}

            {!isLoading && data && (
                <Grid container spacing={2}>
                    {data.items.map((event) => (
                        <Grid item xs={12} sm={6} md={4} key={event.id}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">{event.title}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {new Date(event.date).toLocaleString()}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {event.location} · {event.category}
                                    </Typography>
                                    <Typography variant="body2" sx={{ mt: 1 }}>
                                        {event.description &&
                                            (event.description.length > 80
                                                ? event.description.slice(0, 80) + '...'
                                                : event.description)}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size="small" component={Link} href={`/events/${event.id}`}>
                                        View Details
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
}
