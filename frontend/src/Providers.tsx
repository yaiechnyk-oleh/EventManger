'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
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
} from '@mui/material';
import Link from 'next/link';

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#ff9800',
        },
    },
});

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <AppBar position="static">
                    <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="h6" component={Link} href="/events" sx={{ textDecoration: 'none', color: 'inherit' }}>
                            Event Management System
                        </Typography>
                        <Box>
                            <Button color="inherit" component={Link} href="/events">
                                Events
                            </Button>
                            <Button color="inherit" component={Link} href="/events/map">
                                Map
                            </Button>
                        </Box>

                    </Toolbar>
                </AppBar>
                <Container sx={{ mt: 4, mb: 4 }}>{children}</Container>
            </ThemeProvider>
        </Provider>
    );
};
