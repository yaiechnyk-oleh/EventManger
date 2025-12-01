'use client';

import React, { useState } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Typography,
} from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    useDeleteEventMutation,
    useGetEventByIdQuery,
    useGetRecommendationsQuery,
} from '@/store/eventApi';

export default function EventDetailsPage() {
    const params = useParams();
    const id = params?.id as string;
    const router = useRouter();

    const { data, isLoading, error } = useGetEventByIdQuery(id);
    const { data: recs } = useGetRecommendationsQuery(id);
    const [deleteEvent] = useDeleteEventMutation();
    const [openConfirm, setOpenConfirm] = useState(false);

    if (isLoading) return <CircularProgress />;
    if (error || !data)
        return (
            <Typography color="error" mt={2}>
                Event not found
            </Typography>
        );

    const handleDelete = async () => {
        await deleteEvent(id).unwrap();
        setOpenConfirm(false);
        router.push('/events');
    };

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" mb={2}>
                <Typography variant="h5">{data.title}</Typography>
                <Box display="flex" gap={1}>
                    <Button variant="outlined" component={Link} href={`/events/${id}/edit`}>
                        Edit
                    </Button>
                    <Button variant="outlined" color="error" onClick={() => setOpenConfirm(true)}>
                        Delete
                    </Button>
                </Box>
            </Box>

            <Typography variant="body1" gutterBottom>
                {data.description}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                {new Date(data.date).toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                {data.location} · {data.category}
            </Typography>

            {recs && recs.length > 0 && (
                <Box mt={4}>
                    <Typography variant="h6" mb={2}>
                        Similar events
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={2}>
                        {recs.map((ev) => (
                            <Card key={ev.id} sx={{ minWidth: 250 }}>
                                <CardContent>
                                    <Typography variant="subtitle1">{ev.title}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {new Date(ev.date).toLocaleString()}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {ev.location} · {ev.category}
                                    </Typography>
                                    <Button
                                        variant="text"
                                        size="small"
                                        sx={{ mt: 1 }}
                                        component={Link}
                                        href={`/events/${ev.id}`}
                                    >
                                        View
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </Box>
                </Box>
            )}

            <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
                <DialogTitle>Delete event</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this event? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenConfirm(false)}>Cancel</Button>
                    <Button color="error" onClick={handleDelete}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
