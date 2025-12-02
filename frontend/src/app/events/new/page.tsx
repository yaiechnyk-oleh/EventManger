"use client"
import { Typography, Box, Paper } from "@mui/material"
import { EventForm } from "@/components/events/EventForm"
import { useCreateEventMutation } from "@/store/eventApi"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Add } from "@mui/icons-material"

export default function NewEventPage() {
    const [createEvent, { isLoading }] = useCreateEventMutation()
    const router = useRouter()

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
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
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                }}
            >
                <Add sx={{ fontSize: 48 }} />
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                        Create New Event
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                        Fill in the details below to create an amazing event
                    </Typography>
                </Box>
            </Box>

            <Paper
                elevation={0}
                sx={{
                    p: 4,
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    boxShadow: (theme) =>
                        theme.palette.mode === "light" ? "0 4px 20px rgba(0, 0, 0, 0.08)" : "0 4px 20px rgba(0, 0, 0, 0.3)",
                }}
            >
                <EventForm
                    submitting={isLoading}
                    onSubmit={async (values) => {
                        await createEvent({
                            title: values.title,
                            description: values.description ?? "",
                            date: new Date(values.date).toISOString(),
                            location: values.location,
                            category: values.category,
                            latitude: values.latitude ? Number(values.latitude) : undefined,
                            longitude: values.longitude ? Number(values.longitude) : undefined,
                        }).unwrap()
                        router.push("/events")
                    }}
                />
            </Paper>
        </motion.div>
    )
}
