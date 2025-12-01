'use client';

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import type { Event } from '@/store/eventApi';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Box, Button, Typography } from '@mui/material';
import Link from 'next/link';
const DefaultIcon = L.icon({
    iconUrl: '/leaflet/marker-icon.png',
    iconRetinaUrl: '/leaflet/marker-icon-2x.png',
    shadowUrl: '/leaflet/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Props {
    events: Event[];
}

type LatLng = { lat: number; lng: number };

const RecenterOnLocation: React.FC<{ center: LatLng | null }> = ({ center }) => {
    const map = useMap();

    useEffect(() => {
        if (center) {
            map.setView([center.lat, center.lng], map.getZoom());
        }
    }, [center, map]);

    return null;
};

export const EventsMap: React.FC<Props> = ({ events }) => {
    const [userCenter, setUserCenter] = useState<LatLng | null>(null);

    const eventsWithCoords = events.filter(
        (e) => typeof e.latitude === 'number' && typeof e.longitude === 'number',
    );

    useEffect(() => {
        if (typeof navigator === 'undefined' || !navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setUserCenter({
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                });
            },
            (err) => {
                console.warn('Geolocation error', err);
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 10 * 60 * 1000,
            },
        );
    }, []);

    const lvivCenter: LatLng = { lat: 49.8397, lng: 24.0297 };

    return (
        <Box sx={{ height: 500, borderRadius: 2, overflow: 'hidden', mt: 2 }}>
            {/* @ts-ignore */}
            <MapContainer
                center={[lvivCenter.lat, lvivCenter.lng]}
                zoom={13}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
            >
                <RecenterOnLocation center={userCenter} />

                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {userCenter && (
                    // @ts-ignore
                    <Marker position={[userCenter.lat, userCenter.lng]}>
                        <Popup>
                            <Typography variant="subtitle1">You are here</Typography>
                        </Popup>
                    </Marker>
                )}

                {eventsWithCoords.map((event) => (
                    <Marker
                        key={event.id}
                        position={[event.latitude as number, event.longitude as number]}
                    >
                        <Popup>
                            <Typography variant="subtitle1">{event.title}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                {new Date(event.date).toLocaleString()}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                {event.location} · {event.category}
                            </Typography>
                            <Button
                                component={Link}
                                href={`/events/${event.id}`}
                                size="small"
                                variant="contained"
                            >
                                View
                            </Button>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </Box>
    );
};
