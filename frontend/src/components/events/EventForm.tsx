"use client"

import type React from "react"
import { useState } from "react"
import { Box, Button, MenuItem, TextField, Paper, InputAdornment, Chip, Stack } from "@mui/material"
import { motion } from "framer-motion"
import TitleIcon from "@mui/icons-material/Title"
import DescriptionIcon from "@mui/icons-material/Description"
import EventIcon from "@mui/icons-material/Event"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import CategoryIcon from "@mui/icons-material/Category"
import MyLocationIcon from "@mui/icons-material/MyLocation"
import SaveIcon from "@mui/icons-material/Save"

type EventFormValues = {
    title: string
    description?: string
    date: string
    location: string
    category: string
    latitude?: number
    longitude?: number
}

interface Props {
    initial?: Partial<EventFormValues>
    onSubmit: (values: EventFormValues) => void
    submitting?: boolean
}

export const EventForm: React.FC<Props> = ({ initial, onSubmit, submitting }) => {
    const [values, setValues] = useState<EventFormValues>(() => ({
        title: initial?.title ?? "",
        description: initial?.description ?? "",
        date: initial?.date ?? "",
        location: initial?.location ?? "",
        category: initial?.category ?? "",
        latitude: initial?.latitude,
        longitude: initial?.longitude,
    }))

    const [gettingLocation, setGettingLocation] = useState(false)

    const handleChange =
        (field: keyof EventFormValues) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setValues((prev) => ({ ...prev, [field]: e.target.value }))
        }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(values)
    }

    const handleGetCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser")
            return
        }

        setGettingLocation(true)
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setValues((prev) => ({
                    ...prev,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                }))
                setGettingLocation(false)
            },
            (error) => {
                console.error("Error getting location:", error)
                alert("Unable to get your location")
                setGettingLocation(false)
            },
        )
    }

    const categoryColors: Record<string, string> = {
        Tech: "#3b82f6",
        Music: "#ec4899",
        Sport: "#10b981",
    }

    return (
        <Paper
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            elevation={3}
            sx={{
                p: 4,
                borderRadius: 3,
                background: (theme) =>
                    theme.palette.mode === "dark"
                        ? "linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%)"
                        : "linear-gradient(135deg, rgba(99, 102, 241, 0.02) 0%, rgba(168, 85, 247, 0.02) 100%)",
            }}
        >
            <Box component="form" onSubmit={handleSubmit} display="flex" flexDirection="column" gap={3}>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                    <TextField
                        label="Title"
                        required
                        value={values.title}
                        onChange={handleChange("title")}
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <TitleIcon color="primary" />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                transition: "all 0.3s",
                                "&:hover": {
                                    boxShadow: "0 4px 12px rgba(99, 102, 241, 0.1)",
                                },
                                "&.Mui-focused": {
                                    boxShadow: "0 4px 16px rgba(99, 102, 241, 0.2)",
                                },
                            },
                        }}
                    />
                </motion.div>

                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                    <TextField
                        label="Description"
                        multiline
                        minRows={4}
                        value={values.description ?? ""}
                        onChange={handleChange("description")}
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start" sx={{ alignSelf: "flex-start", mt: 2 }}>
                                    <DescriptionIcon color="primary" />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                transition: "all 0.3s",
                                "&:hover": {
                                    boxShadow: "0 4px 12px rgba(99, 102, 241, 0.1)",
                                },
                            },
                        }}
                    />
                </motion.div>

                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                    <TextField
                        label="Date & Time"
                        type="datetime-local"
                        required
                        value={values.date ? values.date.slice(0, 16) : ""}
                        onChange={handleChange("date")}
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <EventIcon color="primary" />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                transition: "all 0.3s",
                                "&:hover": {
                                    boxShadow: "0 4px 12px rgba(99, 102, 241, 0.1)",
                                },
                            },
                        }}
                    />
                </motion.div>

                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                    <TextField
                        label="Location"
                        required
                        value={values.location}
                        onChange={handleChange("location")}
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LocationOnIcon color="primary" />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                transition: "all 0.3s",
                                "&:hover": {
                                    boxShadow: "0 4px 12px rgba(99, 102, 241, 0.1)",
                                },
                            },
                        }}
                    />
                </motion.div>

                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                    <TextField
                        select
                        label="Category"
                        required
                        value={values.category}
                        onChange={handleChange("category")}
                        fullWidth
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <CategoryIcon color="primary" />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                transition: "all 0.3s",
                                "&:hover": {
                                    boxShadow: "0 4px 12px rgba(99, 102, 241, 0.1)",
                                },
                            },
                        }}
                    >
                        <MenuItem value="Tech">
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Chip label="Tech" size="small" sx={{ bgcolor: "rgba(59, 130, 246, 0.1)", color: "#3b82f6" }} />
                            </Stack>
                        </MenuItem>
                        <MenuItem value="Music">
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Chip label="Music" size="small" sx={{ bgcolor: "rgba(236, 72, 153, 0.1)", color: "#ec4899" }} />
                            </Stack>
                        </MenuItem>
                        <MenuItem value="Sport">
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Chip label="Sport" size="small" sx={{ bgcolor: "rgba(16, 185, 129, 0.1)", color: "#10b981" }} />
                            </Stack>
                        </MenuItem>
                    </TextField>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 2,
                            bgcolor: (theme) => (theme.palette.mode === "dark" ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.02)"),
                            borderRadius: 2,
                        }}
                    >
                        <Stack spacing={2}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Box sx={{ color: "text.secondary", fontSize: "0.875rem", fontWeight: 500 }}>
                                    Coordinates (Optional)
                                </Box>
                                <Button
                                    size="small"
                                    startIcon={<MyLocationIcon />}
                                    onClick={handleGetCurrentLocation}
                                    disabled={gettingLocation}
                                    variant="outlined"
                                    sx={{
                                        borderRadius: 2,
                                        textTransform: "none",
                                        transition: "all 0.3s",
                                        "&:hover": {
                                            transform: "translateY(-2px)",
                                            boxShadow: "0 4px 12px rgba(99, 102, 241, 0.2)",
                                        },
                                    }}
                                >
                                    {gettingLocation ? "Getting..." : "Use My Location"}
                                </Button>
                            </Stack>

                            <Box display="flex" gap={2}>
                                <TextField
                                    label="Latitude"
                                    type="number"
                                    value={values.latitude ?? ""}
                                    onChange={handleChange("latitude")}
                                    fullWidth
                                    inputProps={{ step: "any" }}
                                    size="small"
                                />
                                <TextField
                                    label="Longitude"
                                    type="number"
                                    value={values.longitude ?? ""}
                                    onChange={handleChange("longitude")}
                                    fullWidth
                                    inputProps={{ step: "any" }}
                                    size="small"
                                />
                            </Box>
                        </Stack>
                    </Paper>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
                    <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={submitting}
                            size="large"
                            startIcon={<SaveIcon />}
                            sx={{
                                px: 4,
                                py: 1.5,
                                borderRadius: 2,
                                background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                                textTransform: "none",
                                fontSize: "1rem",
                                fontWeight: 600,
                                boxShadow: "0 4px 16px rgba(99, 102, 241, 0.3)",
                                transition: "all 0.3s",
                                "&:hover": {
                                    transform: "scale(1.02)",
                                    boxShadow: "0 8px 24px rgba(99, 102, 241, 0.4)",
                                },
                                "&:active": {
                                    transform: "scale(0.98)",
                                },
                                "&:disabled": {
                                    background: "rgba(99, 102, 241, 0.3)",
                                },
                            }}
                        >
                            {submitting ? "Saving..." : "Save Event"}
                        </Button>
                    </Box>
                </motion.div>
            </Box>
        </Paper>
    )
}