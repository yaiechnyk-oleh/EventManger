"use client"
import { useGetEventsQuery } from "@/store/eventApi"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { setSortBy, setCategoryFilter } from "@/store/uiSlice"
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Typography,
    Chip,
    alpha,
    Fade,
    Skeleton,
    TextField,
    InputAdornment,
} from "@mui/material"
import {
    Add,
    CalendarMonth,
    LocationOn,
    Category as CategoryIcon,
    Sort,
    FilterList,
    Search as SearchIcon,
} from "@mui/icons-material"
import Link from "next/link"
import { motion } from "framer-motion"
import { useState, useMemo } from "react"

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
}

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
}

export default function EventsPage() {
    const dispatch = useAppDispatch()
    const { sortBy, categoryFilter } = useAppSelector((s) => s.ui)
    const [searchQuery, setSearchQuery] = useState("")

    const { data, isLoading, error } = useGetEventsQuery({
        sortBy,
        category: categoryFilter && categoryFilter !== "" ? categoryFilter : undefined,
    })

    const filteredEvents = useMemo(() => {
        if (!data?.items) return []
        if (!searchQuery.trim()) return data.items

        const query = searchQuery.toLowerCase()
        return data.items.filter(
            (event) =>
                event.title.toLowerCase().includes(query) ||
                event.description?.toLowerCase().includes(query) ||
                event.location.toLowerCase().includes(query) ||
                event.category.toLowerCase().includes(query),
        )
    }, [data?.items, searchQuery])

    return (
        <Box>
            <Box
                component={motion.div}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                sx={{
                    mb: 4,
                    p: 4,
                    borderRadius: 3,
                    background: (theme) =>
                        theme.palette.mode === "light"
                            ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                            : "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
                    color: "white",
                }}
            >
                <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                    Discover Events
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                    Find and manage amazing events happening around you
                </Typography>
            </Box>

            <Box
                component={motion.div}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 2,
                    mb: 4,
                    p: 3,
                    bgcolor: "background.paper",
                    borderRadius: 3,
                    boxShadow: (theme) =>
                        theme.palette.mode === "light" ? "0 2px 12px rgba(0, 0, 0, 0.08)" : "0 2px 12px rgba(0, 0, 0, 0.3)",
                }}
            >
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
                    <TextField
                        placeholder="Search events by title, description, location, or category..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        fullWidth
                        size="small"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon color="primary" />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
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

                    <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
                        <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
                            <FilterList color="primary" />
                            <FormControl size="small" sx={{ minWidth: 200 }}>
                                <InputLabel>Sort By</InputLabel>
                                <Select
                                    label="Sort By"
                                    value={sortBy}
                                    onChange={(e) => dispatch(setSortBy(e.target.value as any))}
                                    sx={{ borderRadius: 2 }}
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <Sort fontSize="small" color="action" />
                                        </InputAdornment>
                                    }
                                >
                                    <MenuItem value="dateAsc">Date (Earliest First)</MenuItem>
                                    <MenuItem value="dateDesc">Date (Latest First)</MenuItem>
                                    <MenuItem value="titleAsc">Title (A-Z)</MenuItem>
                                    <MenuItem value="titleDesc">Title (Z-A)</MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl size="small" sx={{ minWidth: 180 }}>
                                <InputLabel>Category</InputLabel>
                                <Select
                                    label="Category"
                                    value={categoryFilter ?? ""}
                                    displayEmpty={true}
                                    onChange={(e) => dispatch(setCategoryFilter(e.target.value || undefined))}
                                    sx={{ borderRadius: 2 }}
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <CategoryIcon fontSize="small" color="action" />
                                        </InputAdornment>
                                    }
                                >
                                    <MenuItem value="">All Categories</MenuItem>
                                    <MenuItem value="Tech">Tech</MenuItem>
                                    <MenuItem value="Music">Music</MenuItem>
                                    <MenuItem value="Sport">Sport</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        <Button
                            variant="contained"
                            component={Link}
                            href="/events/new"
                            startIcon={<Add />}
                            size="large"
                            sx={{
                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                "&:hover": {
                                    background: "linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)",
                                },
                            }}
                        >
                            Create Event
                        </Button>
                    </Box>
                </Box>
            </Box>

            {isLoading && (
                <Grid container spacing={3}>
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Grid item xs={12} sm={6} md={4} key={i}>
                            <Card>
                                <CardContent>
                                    <Skeleton variant="text" width="80%" height={32} />
                                    <Skeleton variant="text" width="60%" />
                                    <Skeleton variant="text" width="70%" />
                                    <Skeleton variant="rectangular" height={60} sx={{ mt: 1, borderRadius: 1 }} />
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {error && (
                <Fade in>
                    <Box
                        sx={{
                            p: 4,
                            textAlign: "center",
                            bgcolor: alpha("#ef4444", 0.1),
                            borderRadius: 3,
                            border: "1px solid",
                            borderColor: alpha("#ef4444", 0.3),
                        }}
                    >
                        <Typography color="error" variant="h6">
                            Failed to load events
                        </Typography>
                        <Typography color="text.secondary" sx={{ mt: 1 }}>
                            Please try again later
                        </Typography>
                    </Box>
                </Fade>
            )}

            {!isLoading && data && (
                <motion.div variants={containerVariants} initial="hidden" animate="show">
                    {searchQuery && (
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" color="text.secondary">
                                Found {filteredEvents.length} result{filteredEvents.length !== 1 ? "s" : ""} for "{searchQuery}"
                            </Typography>
                        </Box>
                    )}

                    <Grid container spacing={3}>
                        {filteredEvents.map((event, index) => (
                            <Grid item xs={12} sm={6} md={4} key={event.id}>
                                <motion.div variants={itemVariants}>
                                    <Card
                                        sx={{
                                            height: "100%",
                                            display: "flex",
                                            flexDirection: "column",
                                            position: "relative",
                                            overflow: "hidden",
                                            "&::before": {
                                                content: '""',
                                                position: "absolute",
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                height: 4,
                                                background:
                                                    index % 3 === 0
                                                        ? "linear-gradient(90deg, #667eea 0%, #764ba2 100%)"
                                                        : index % 3 === 1
                                                            ? "linear-gradient(90deg, #f093fb 0%, #f5576c 100%)"
                                                            : "linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)",
                                            },
                                        }}
                                    >
                                        <CardContent sx={{ flexGrow: 1, p: 3 }}>
                                            <Typography
                                                variant="h6"
                                                gutterBottom
                                                sx={{
                                                    fontWeight: 700,
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    display: "-webkit-box",
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: "vertical",
                                                }}
                                            >
                                                {event.title}
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
                                                    {new Date(event.date).toLocaleDateString("en-US", {
                                                        month: "short",
                                                        day: "numeric",
                                                        year: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
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
                                                    {event.location}
                                                </Typography>
                                            </Box>

                                            <Chip
                                                label={event.category}
                                                size="small"
                                                sx={{
                                                    mb: 2,
                                                    fontWeight: 600,
                                                    background:
                                                        event.category === "Tech"
                                                            ? alpha("#667eea", 0.15)
                                                            : event.category === "Music"
                                                                ? alpha("#f5576c", 0.15)
                                                                : alpha("#00f2fe", 0.15),
                                                    color:
                                                        event.category === "Tech" ? "#667eea" : event.category === "Music" ? "#f5576c" : "#00a8cc",
                                                }}
                                            />

                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    display: "-webkit-box",
                                                    WebkitLineClamp: 3,
                                                    WebkitBoxOrient: "vertical",
                                                }}
                                            >
                                                {event.description || "No description available"}
                                            </Typography>
                                        </CardContent>
                                        <CardActions sx={{ p: 2, pt: 0 }}>
                                            <Button
                                                size="medium"
                                                variant="contained"
                                                component={Link}
                                                href={`/events/${event.id}`}
                                                fullWidth
                                                sx={{
                                                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                                    fontWeight: 600,
                                                }}
                                            >
                                                View Details
                                            </Button>
                                        </CardActions>
                                    </Card>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>

                    {filteredEvents.length === 0 && (
                        <Box
                            sx={{
                                textAlign: "center",
                                py: 8,
                                px: 2,
                            }}
                        >
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                {searchQuery ? "No events found matching your search" : "No events found"}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                {searchQuery
                                    ? "Try adjusting your search terms or filters"
                                    : "Try adjusting your filters or create a new event"}
                            </Typography>
                            {!searchQuery && (
                                <Button variant="contained" component={Link} href="/events/new" startIcon={<Add />}>
                                    Create First Event
                                </Button>
                            )}
                        </Box>
                    )}
                </motion.div>
            )}
        </Box>
    )
}
