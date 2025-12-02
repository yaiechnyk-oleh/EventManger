"use client"

import React from "react"
import { Provider } from "react-redux"
import { store } from "./store/store"
import {
    AppBar,
    Toolbar,
    Typography,
    CssBaseline,
    Container,
    ThemeProvider,
    createTheme,
    Box,
    Button,
    IconButton,
    alpha,
} from "@mui/material"
import Link from "next/link"
import { EventAvailable, Map as MapIcon, Brightness4, Brightness7 } from "@mui/icons-material"
import { motion } from "framer-motion"

const getTheme = (mode: "light" | "dark") =>
    createTheme({
        palette: {
            mode,
            primary: {
                main: mode === "light" ? "#6366f1" : "#818cf8",
                light: "#a5b4fc",
                dark: "#4f46e5",
            },
            secondary: {
                main: mode === "light" ? "#ec4899" : "#f472b6",
                light: "#f9a8d4",
                dark: "#db2777",
            },
            background: {
                default: mode === "light" ? "#f8fafc" : "#0f172a",
                paper: mode === "light" ? "#ffffff" : "#1e293b",
            },
            text: {
                primary: mode === "light" ? "#1e293b" : "#f1f5f9",
                secondary: mode === "light" ? "#64748b" : "#94a3b8",
            },
        },
        typography: {
            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
            h4: {
                fontWeight: 700,
                letterSpacing: "-0.02em",
            },
            h5: {
                fontWeight: 700,
                letterSpacing: "-0.01em",
            },
            h6: {
                fontWeight: 600,
            },
        },
        shape: {
            borderRadius: 12,
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        textTransform: "none",
                        fontWeight: 600,
                        borderRadius: 10,
                        padding: "10px 24px",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                        },
                    },
                    contained: {
                        boxShadow: "0 4px 14px 0 rgba(99, 102, 241, 0.39)",
                    },
                },
            },
            MuiCard: {
                styleOverrides: {
                    root: {
                        borderRadius: 16,
                        boxShadow: mode === "light" ? "0 4px 20px rgba(0, 0, 0, 0.08)" : "0 4px 20px rgba(0, 0, 0, 0.4)",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow: mode === "light" ? "0 12px 40px rgba(0, 0, 0, 0.12)" : "0 12px 40px rgba(0, 0, 0, 0.6)",
                        },
                    },
                },
            },
            MuiAppBar: {
                styleOverrides: {
                    root: {
                        backgroundImage: "none",
                        boxShadow: mode === "light" ? "0 1px 3px rgba(0, 0, 0, 0.05)" : "0 1px 3px rgba(0, 0, 0, 0.3)",
                    },
                },
            },
        },
    })

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [mode, setMode] = React.useState<"light" | "dark" | undefined>(undefined)

    React.useEffect(() => {
        setMode("light")
    }, [])

    const theme = React.useMemo(() => getTheme(mode || "light"), [mode])

    return (
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <AppBar
                    position="sticky"
                    sx={{
                        background:
                            mode === "dark"
                                ? "linear-gradient(135deg, #1e293b 0%, #334155 100%)"
                                : "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                        backdropFilter: "blur(20px)",
                    }}
                >
                    <Toolbar sx={{ display: "flex", justifyContent: "space-between", py: 1 }}>
                        <Box
                            component={motion.div}
                            whileHover={{ scale: 1.05 }}
                            sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                            <EventAvailable sx={{ fontSize: 32 }} />
                            <Typography
                                variant="h6"
                                component={Link}
                                href="/events"
                                sx={{
                                    textDecoration: "none",
                                    color: "inherit",
                                    fontWeight: 700,
                                    letterSpacing: "-0.01em",
                                }}
                            >
                                Event Management
                            </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Button
                                color="inherit"
                                component={Link}
                                href="/events"
                                startIcon={<EventAvailable />}
                                sx={{
                                    "&:hover": {
                                        backgroundColor: alpha("#ffffff", 0.1),
                                    },
                                }}
                            >
                                Events
                            </Button>
                            <Button
                                color="inherit"
                                component={Link}
                                href="/events/map"
                                startIcon={<MapIcon />}
                                sx={{
                                    "&:hover": {
                                        backgroundColor: alpha("#ffffff", 0.1),
                                    },
                                }}
                            >
                                Map
                            </Button>
                            {mode !== undefined && (
                                <IconButton onClick={() => setMode(mode === "light" ? "dark" : "light")} color="inherit" sx={{ ml: 1 }}>
                                    {mode === "light" ? <Brightness4 /> : <Brightness7 />}
                                </IconButton>
                            )}
                        </Box>
                    </Toolbar>
                </AppBar>
                <Container sx={{ mt: 4, mb: 4 }}>{children}</Container>
            </ThemeProvider>
        </Provider>
    )
}
