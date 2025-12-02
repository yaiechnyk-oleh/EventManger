"use client"
import dynamic from "next/dynamic"
import {
    Box,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Typography,
    Paper,
    Stack,
    Chip,
    InputAdornment,
} from "@mui/material"
import { motion } from "framer-motion"
import MapIcon from "@mui/icons-material/Map"
import FilterListIcon from "@mui/icons-material/FilterList"
import { useGetEventsQuery } from "@/store/eventApi"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { setCategoryFilter } from "@/store/uiSlice"

const EventsMap = dynamic(() => import("../../../components/events/EventsMap").then((m) => m.EventsMap), {
    ssr: false,
    loading: () => (
        <Paper
            sx={{
                height: 600,
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%)",
            }}
        >
            <Stack spacing={2} alignItems="center">
                <CircularProgress size={48} thickness={4} />
                <Typography variant="body1" color="text.secondary">
                    Loading map...
                </Typography>
            </Stack>
        </Paper>
    ),
})

export default function EventsMapPage() {
    const dispatch = useAppDispatch()
    const { categoryFilter } = useAppSelector((s) => s.ui)

    const { data, isLoading, error } = useGetEventsQuery({
        category: categoryFilter,
        limit: 100,
    })

    const categoryColors: Record<string, string> = {
        Tech: "#3b82f6",
        Music: "#ec4899",
        Sport: "#10b981",
    }

    return (
        <Box>
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Paper
                    elevation={2}
                    sx={{
                        p: 3,
                        mb: 3,
                        borderRadius: 3,
                        background: "linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(168, 85, 247, 0.08) 100%)",
                    }}
                >
                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        justifyContent="space-between"
                        alignItems={{ xs: "flex-start", sm: "center" }}
                        spacing={2}
                    >
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Box
                                sx={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 2,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                                    boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
                                }}
                            >
                                <MapIcon sx={{ color: "white", fontSize: 28 }} />
                            </Box>
                            <Box>
                                <Typography variant="h4" fontWeight={700}>
                                    Events Map
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                    Explore events on an interactive map
                                </Typography>
                            </Box>
                        </Stack>

                        <FormControl component={motion.div} whileHover={{ scale: 1.02 }} size="small" sx={{ minWidth: 180 }}>
                            <InputLabel>Category</InputLabel>
                            <Select
                                label="Category"
                                value={categoryFilter ?? ""}
                                displayEmpty={true}
                                onChange={(e) => dispatch(setCategoryFilter(e.target.value || undefined))}
                                sx={{
                                    borderRadius: 2,
                                    bgcolor: "background.paper",
                                    transition: "all 0.3s",
                                    "&:hover": {
                                        boxShadow: "0 4px 12px rgba(99, 102, 241, 0.15)",
                                    },
                                }}
                                startAdornment={
                                    <InputAdornment position="start" sx={{ mr: 1 }}>
                                        <FilterListIcon fontSize="small" />
                                    </InputAdornment>
                                }
                            >
                                <MenuItem value="">All Categories</MenuItem>
                                <MenuItem value="Tech">
                                    <Chip
                                        label="Tech"
                                        size="small"
                                        sx={{
                                            bgcolor: "rgba(59, 130, 246, 0.1)",
                                            color: categoryColors.Tech,
                                            fontWeight: 600,
                                        }}
                                    />
                                </MenuItem>
                                <MenuItem value="Music">
                                    <Chip
                                        label="Music"
                                        size="small"
                                        sx={{
                                            bgcolor: "rgba(236, 72, 153, 0.1)",
                                            color: categoryColors.Music,
                                            fontWeight: 600,
                                        }}
                                    />
                                </MenuItem>
                                <MenuItem value="Sport">
                                    <Chip
                                        label="Sport"
                                        size="small"
                                        sx={{
                                            bgcolor: "rgba(16, 185, 129, 0.1)",
                                            color: categoryColors.Sport,
                                            fontWeight: 600,
                                        }}
                                    />
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Stack>

                    {data && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                                <Chip
                                    label={`${data.items.length} events found`}
                                    color="primary"
                                    variant="outlined"
                                    sx={{ fontWeight: 600 }}
                                />
                                {categoryFilter && (
                                    <Chip
                                        label={`Filtered by ${categoryFilter}`}
                                        sx={{
                                            bgcolor: `${categoryColors[categoryFilter]}15`,
                                            color: categoryColors[categoryFilter],
                                            fontWeight: 600,
                                        }}
                                    />
                                )}
                            </Stack>
                        </motion.div>
                    )}
                </Paper>
            </motion.div>

            {isLoading && (
                <Paper
                    sx={{
                        height: 600,
                        borderRadius: 3,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%)",
                    }}
                >
                    <Stack spacing={2} alignItems="center">
                        <CircularProgress size={48} thickness={4} />
                        <Typography variant="body1" color="text.secondary">
                            Loading events...
                        </Typography>
                    </Stack>
                </Paper>
            )}

            {error && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                    <Paper
                        sx={{
                            p: 4,
                            borderRadius: 3,
                            textAlign: "center",
                            bgcolor: "error.lighter",
                            border: "1px solid",
                            borderColor: "error.light",
                        }}
                    >
                        <Typography color="error" variant="h6" fontWeight={600}>
                            Failed to load events for map
                        </Typography>
                        <Typography color="text.secondary" variant="body2" sx={{ mt: 1 }}>
                            Please try refreshing the page
                        </Typography>
                    </Paper>
                </motion.div>
            )}

            {data && <EventsMap events={data.items} />}
        </Box>
    )
}
