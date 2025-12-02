"use client"

import { useState } from "react"
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
    Chip,
    Grid,
    alpha,
    IconButton,
    Fade,
} from "@mui/material"
import { CalendarMonth, LocationOn, Edit, Delete, ArrowBack, Share } from "@mui/icons-material"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useDeleteEventMutation, useGetEventByIdQuery, useGetRecommendationsQuery } from "@/store/eventApi"
import { motion } from "framer-motion"

export default function EventDetailsPage() {
    const params = useParams()
    const id = params?.id as string
    const router = useRouter()

    const { data, isLoading, error } = useGetEventByIdQuery(id)
    const { data: recs } = useGetRecommendationsQuery(id)
    const [deleteEvent, { isLoading: isDeleting }] = useDeleteEventMutation()
    const [openConfirm, setOpenConfirm] = useState(false)

    if (isLoading)
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress size={60} />
            </Box>
        )

    if (error || !data)
        return (
            <Fade in>
                <Box
                    sx={{
                        textAlign: "center",
                        py: 8,
                        px: 2,
                        bgcolor: alpha("#ef4444", 0.1),
                        borderRadius: 3,
                        border: "1px solid",
                        borderColor: alpha("#ef4444", 0.3),
                    }}
                >
                    <Typography variant="h5" color="error" gutterBottom>
                        Event not found
                    </Typography>
                    <Typography color="text.secondary" sx={{ mb: 3 }}>
                        The event you're looking for doesn't exist or has been removed
                    </Typography>
                    <Button variant="contained" component={Link} href="/events" startIcon={<ArrowBack />}>
                        Back to Events
                    </Button>
                </Box>
            </Fade>
        )

    const handleDelete = async () => {
        await deleteEvent(id).unwrap()
        setOpenConfirm(false)
        router.push("/events")
    }

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Button startIcon={<ArrowBack />} component={Link} href="/events" sx={{ mb: 3 }} variant="outlined">
                Back to Events
            </Button>

            <Box
                sx={{
                    mb: 4,
                    p: 4,
                    borderRadius: 3,
                    background: (theme) =>
                        theme.palette.mode === "light"
                            ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                            : "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
                    color: "white",
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        display: "flex",
                        gap: 1,
                        p: 2,
                    }}
                >
                    <IconButton
                        sx={{ color: "white", bgcolor: alpha("#fff", 0.2) }}
                        size="small"
                        onClick={() => {
                            if (navigator.share) {
                                navigator.share({
                                    title: data.title,
                                    text: data.description || "",
                                    url: window.location.href,
                                })
                            }
                        }}
                    >
                        <Share />
                    </IconButton>
                    <IconButton
                        component={Link}
                        href={`/events/${id}/edit`}
                        sx={{ color: "white", bgcolor: alpha("#fff", 0.2) }}
                        size="small"
                    >
                        <Edit />
                    </IconButton>
                    <IconButton
                        onClick={() => setOpenConfirm(true)}
                        sx={{ color: "white", bgcolor: alpha("#fff", 0.2) }}
                        size="small"
                    >
                        <Delete />
                    </IconButton>
                </Box>

                <Chip
                    label={data.category}
                    sx={{
                        mb: 2,
                        bgcolor: alpha("#fff", 0.25),
                        color: "white",
                        fontWeight: 600,
                    }}
                />
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
                    {data.title}
                </Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <CalendarMonth sx={{ fontSize: 28 }} />
                            <Box>
                                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                                    Date & Time
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                    {new Date(data.date).toLocaleDateString("en-US", {
                                        weekday: "long",
                                        month: "long",
                                        day: "numeric",
                                        year: "numeric",
                                    })}
                                </Typography>
                                <Typography variant="body2">
                                    {new Date(data.date).toLocaleTimeString("en-US", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <LocationOn sx={{ fontSize: 28 }} />
                            <Box>
                                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                                    Location
                                </Typography>
                                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                    {data.location}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Box>

            <Card sx={{ mb: 4 }}>
                <CardContent sx={{ p: 4 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
                        About This Event
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
                        {data.description || "No description available for this event."}
                    </Typography>
                </CardContent>
            </Card>

            {recs && recs.length > 0 && (
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
                        Similar Events You Might Like
                    </Typography>
                    <Grid container spacing={3}>
                        {recs.map((ev, index) => (
                            <Grid item xs={12} sm={6} md={4} key={ev.id}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card
                                        sx={{
                                            height: "100%",
                                            position: "relative",
                                            "&::before": {
                                                content: '""',
                                                position: "absolute",
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                height: 3,
                                                background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
                                            },
                                        }}
                                    >
                                        <CardContent sx={{ p: 3 }}>
                                            <Chip
                                                label={ev.category}
                                                size="small"
                                                sx={{
                                                    mb: 1.5,
                                                    fontWeight: 600,
                                                    background: alpha("#667eea", 0.15),
                                                    color: "#667eea",
                                                }}
                                            />
                                            <Typography
                                                variant="h6"
                                                gutterBottom
                                                sx={{
                                                    fontWeight: 600,
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    display: "-webkit-box",
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: "vertical",
                                                }}
                                            >
                                                {ev.title}
                                            </Typography>
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 0.5,
                                                    color: "text.secondary",
                                                    mb: 1,
                                                }}
                                            >
                                                <CalendarMonth fontSize="small" />
                                                <Typography variant="body2">
                                                    {new Date(ev.date).toLocaleDateString("en-US", {
                                                        month: "short",
                                                        day: "numeric",
                                                    })}
                                                </Typography>
                                            </Box>
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 0.5,
                                                    color: "text.secondary",
                                                    mb: 2,
                                                }}
                                            >
                                                <LocationOn fontSize="small" />
                                                <Typography variant="body2" noWrap>
                                                    {ev.location}
                                                </Typography>
                                            </Box>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                fullWidth
                                                component={Link}
                                                href={`/events/${ev.id}`}
                                                sx={{
                                                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                                }}
                                            >
                                                View Details
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}

            <Dialog
                open={openConfirm}
                onClose={() => setOpenConfirm(false)}
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        p: 1,
                    },
                }}
            >
                <DialogTitle sx={{ fontWeight: 700 }}>Delete Event?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete "{data.title}"? This action cannot be undone and all event data will be
                        permanently removed.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ p: 2, gap: 1 }}>
                    <Button onClick={() => setOpenConfirm(false)} variant="outlined">
                        Cancel
                    </Button>
                    <Button
                        color="error"
                        onClick={handleDelete}
                        variant="contained"
                        disabled={isDeleting}
                        startIcon={isDeleting ? <CircularProgress size={16} /> : <Delete />}
                    >
                        {isDeleting ? "Deleting..." : "Delete Event"}
                    </Button>
                </DialogActions>
            </Dialog>
        </motion.div>
    )
}
