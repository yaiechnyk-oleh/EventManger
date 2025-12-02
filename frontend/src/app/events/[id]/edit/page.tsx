"use client"
import { Typography, CircularProgress, Paper, Stack, Box, Breadcrumbs, Link as MuiLink } from "@mui/material"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import EditIcon from "@mui/icons-material/Edit"
import HomeIcon from "@mui/icons-material/Home"
import EventIcon from "@mui/icons-material/Event"
import NavigateNextIcon from "@mui/icons-material/NavigateNext"
import { EventForm } from "@/components/events/EventForm"
import { useGetEventByIdQuery, useUpdateEventMutation } from "@/store/eventApi"

export default function EditEventPage() {
    const params = useParams()
    const id = params?.id as string
    const { data, isLoading } = useGetEventByIdQuery(id)
    const [updateEvent, { isLoading: isSaving }] = useUpdateEventMutation()
    const router = useRouter()

    if (isLoading || !data) {
        return (
            <Paper
                sx={{
                    p: 6,
                    borderRadius: 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 400,
                    background: "linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%)",
                }}
            >
                <Stack spacing={2} alignItems="center">
                    <CircularProgress size={48} thickness={4} />
                    <Typography variant="body1" color="text.secondary">
                        Loading event...
                    </Typography>
                </Stack>
            </Paper>
        )
    }

    return (
        <Box>
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 3 }}>
                    <MuiLink component={Link} href="/" underline="hover" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <HomeIcon fontSize="small" />
                        Home
                    </MuiLink>
                    <MuiLink
                        component={Link}
                        href="/events"
                        underline="hover"
                        sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                        <EventIcon fontSize="small" />
                        Events
                    </MuiLink>
                    <MuiLink component={Link} href={`/events/${id}`} underline="hover">
                        {data.title}
                    </MuiLink>
                    <Typography color="text.primary" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <EditIcon fontSize="small" />
                        Edit
                    </Typography>
                </Breadcrumbs>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
            >
                <Paper
                    elevation={2}
                    sx={{
                        p: 3,
                        mb: 4,
                        borderRadius: 3,
                        background: "linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(168, 85, 247, 0.08) 100%)",
                    }}
                >
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Box
                            sx={{
                                width: 56,
                                height: 56,
                                borderRadius: 2,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                                boxShadow: "0 4px 16px rgba(99, 102, 241, 0.3)",
                            }}
                        >
                            <EditIcon sx={{ color: "white", fontSize: 32 }} />
                        </Box>
                        <Box>
                            <Typography variant="h4" fontWeight={700}>
                                Edit Event
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                Update the details of "{data.title}"
                            </Typography>
                        </Box>
                    </Stack>
                </Paper>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <EventForm
                    initial={{
                        title: data.title,
                        description: data.description ?? "",
                        date: data.date,
                        location: data.location,
                        category: data.category,
                        latitude: data.latitude,
                        longitude: data.longitude,
                    }}
                    submitting={isSaving}
                    onSubmit={async (values) => {
                        await updateEvent({
                            id,
                            data: {
                                title: values.title,
                                description: values.description ?? "",
                                date: values.date ? new Date(values.date).toISOString() : data.date,
                                location: values.location,
                                category: values.category,
                                latitude: values.latitude ? Number(values.latitude) : data.latitude,
                                longitude: values.longitude ? Number(values.longitude) : data.longitude,
                            },
                        }).unwrap()
                        router.push(`/events/${id}`)
                    }}
                />
            </motion.div>
        </Box>
    )
}
