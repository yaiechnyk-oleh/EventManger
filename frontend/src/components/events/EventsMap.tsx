"use client"

import type React from "react"
import { useMemo, useState, useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import type { Event } from "../../store/eventApi"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { Box, Button, Typography, Chip, Stack, Paper, Fade, useTheme } from "@mui/material"
import Link from "next/link"
import { motion } from "framer-motion"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import EventIcon from "@mui/icons-material/Event"
import VisibilityIcon from "@mui/icons-material/Visibility"

// Default marker icon, assets from /public/leaflet
const DefaultIcon = L.icon({
    iconUrl: "/leaflet/marker-icon.png",
    iconRetinaUrl: "/leaflet/marker-icon-2x.png",
    shadowUrl: "/leaflet/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
})

L.Marker.prototype.options.icon = DefaultIcon

interface Props {
    events: Event[]
}

const RecenterMap = ({ center }: { center: LatLng }) => {
    const map = useMap()

    useEffect(() => {
        map.flyTo([center.lat, center.lng], map.getZoom())
    }, [center, map])

    return null
}

type LatLng = { lat: number; lng: number }

export const EventsMap: React.FC<Props> = ({ events }) => {
    const theme = useTheme()
    const isDark = theme.palette.mode === "dark"

    const [userCenter, setUserCenter] = useState<LatLng | null>(null)
    const [mapReady, setMapReady] = useState(false)

    const eventsWithCoords = events.filter((e) => typeof e.latitude === "number" && typeof e.longitude === "number")

    useEffect(() => {
        if (typeof navigator === "undefined" || !navigator.geolocation) return

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setUserCenter({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                })
            },
            (err) => {
                console.warn("Geolocation error", err)
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 10 * 60 * 1000,
            },
        )

        setTimeout(() => setMapReady(true), 300)
    }, [])

    useEffect(() => {
        const style = document.getElementById("leaflet-popup-style")
        if (style) {
            style.textContent = isDark
                ? `
                  .leaflet-popup-content-wrapper {
                    background-color: #1e1e1e !important;
                    color: #ffffff !important;
                    border-radius: 12px !important;
                    transition: background-color 0.3s ease !important;
                  }
                  .leaflet-popup-tip {
                    background-color: #1e1e1e !important;
                  }
                  .leaflet-popup-close-button {
                    color: #ffffff !important;
                  }
                `
                : `
                  .leaflet-popup-content-wrapper {
                    background-color: #ffffff !important;
                    color: #000000 !important;
                    border-radius: 12px !important;
                    transition: background-color 0.3s ease !important;
                  }
                  .leaflet-popup-tip {
                    background-color: #ffffff !important;
                  }
                  .leaflet-popup-close-button {
                    color: #000000 !important;
                  }
                `
        } else {
            const newStyle = document.createElement("style")
            newStyle.id = "leaflet-popup-style"
            newStyle.textContent = isDark
                ? `
                  .leaflet-popup-content-wrapper {
                    background-color: #1e1e1e !important;
                    color: #ffffff !important;
                    border-radius: 12px !important;
                    transition: background-color 0.3s ease !important;
                  }
                  .leaflet-popup-tip {
                    background-color: #1e1e1e !important;
                  }
                  .leaflet-popup-close-button {
                    color: #ffffff !important;
                  }
                `
                : `
                  .leaflet-popup-content-wrapper {
                    background-color: #ffffff !important;
                    color: #000000 !important;
                    border-radius: 12px !important;
                    transition: background-color 0.3s ease !important;
                  }
                  .leaflet-popup-tip {
                    background-color: #ffffff !important;
                  }
                  .leaflet-popup-close-button {
                    color: #000000 !important;
                  }
                `
            document.head.appendChild(newStyle)
        }
    }, [isDark])

    const center = useMemo<LatLng>(() => {
        if (userCenter) return userCenter

        if (eventsWithCoords.length) {
            const latSum = eventsWithCoords.reduce((sum, e) => sum + (e.latitude ?? 0), 0)
            const lngSum = eventsWithCoords.reduce((sum, e) => sum + (e.longitude ?? 0), 0)

            return {
                lat: latSum / eventsWithCoords.length,
                lng: lngSum / eventsWithCoords.length,
            }
        }

        return { lat: 49.8397, lng: 24.0297 }
    }, [userCenter, eventsWithCoords])

    const categoryColors: Record<string, string> = {
        Tech: "#3b82f6",
        Music: "#ec4899",
        Sport: "#10b981",
    }

    return (
        <Paper
            component={motion.div}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            elevation={4}
            sx={{
                height: 600,
                borderRadius: 3,
                overflow: "hidden",
                mt: 2,
                position: "relative",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
            }}
        >
            <Fade in={mapReady}>
                <Paper
                    elevation={3}
                    sx={{
                        position: "absolute",
                        top: 16,
                        right: 16,
                        zIndex: 1000,
                        p: 2,
                        bgcolor: (theme) =>
                            theme.palette.mode === "dark" ? "rgba(18, 18, 18, 0.95)" : "rgba(255, 255, 255, 0.95)",
                        backdropFilter: "blur(10px)",
                        borderRadius: 2,
                        transition: "background-color 0.3s ease",
                    }}
                >
                    <Stack spacing={1}>
                        <Typography variant="subtitle2" fontWeight={600}>
                            Map Statistics
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <LocationOnIcon fontSize="small" color="primary" />
                            <Typography variant="body2">{eventsWithCoords.length} events with location</Typography>
                        </Stack>
                        {userCenter && <Chip label="Your location visible" size="small" color="success" sx={{ mt: 1 }} />}
                    </Stack>
                </Paper>
            </Fade>

            <MapContainer
                center={[center.lat, center.lng]}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <RecenterMap center={center} />
                {userCenter && (
                    <Marker position={[userCenter.lat, userCenter.lng]}>
                        <Popup>
                            <Box sx={{ p: 1 }}>
                                <Stack spacing={1} alignItems="center">
                                    <LocationOnIcon color="primary" />
                                    <Typography variant="subtitle1" fontWeight={600}>
                                        You are here
                                    </Typography>
                                </Stack>
                            </Box>
                        </Popup>
                    </Marker>
                )}

                {eventsWithCoords.map((event) => (
                    <Marker key={event.id} position={[event.latitude as number, event.longitude as number]}>
                        <Popup maxWidth={280}>
                            <Box sx={{ p: 1 }}>
                                <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5, color: "primary.main" }}>
                                    {event.title}
                                </Typography>

                                <Stack spacing={1} sx={{ mb: 2 }}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <EventIcon fontSize="small" sx={{ color: "text.secondary" }} />
                                        <Typography variant="body2" color="text.secondary">
                                            {new Date(event.date).toLocaleString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </Typography>
                                    </Stack>

                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <LocationOnIcon fontSize="small" sx={{ color: "text.secondary" }} />
                                        <Typography variant="body2" color="text.secondary">
                                            {event.location}
                                        </Typography>
                                    </Stack>

                                    <Chip
                                        label={event.category}
                                        size="small"
                                        sx={{
                                            bgcolor: `${categoryColors[event.category]}15`,
                                            color: categoryColors[event.category],
                                            fontWeight: 600,
                                            alignSelf: "flex-start",
                                        }}
                                    />
                                </Stack>

                                <Button
                                    component={Link}
                                    href={`/events/${event.id}`}
                                    size="small"
                                    variant="contained"
                                    fullWidth
                                    startIcon={<VisibilityIcon />}
                                    sx={{
                                        borderRadius: 1.5,
                                        textTransform: "none",
                                        fontWeight: 600,
                                        background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                                        color: "#ffffff !important",
                                        "& .MuiButton-startIcon": {
                                            color: "#ffffff !important",
                                        },
                                        "&:hover": {
                                            transform: "translateY(-1px)",
                                            boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
                                            background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
                                        },
                                    }}
                                >
                                    View Details
                                </Button>
                            </Box>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </Paper>
    )
}
