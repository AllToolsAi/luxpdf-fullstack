// src/layouts/DashboardLayout.js
import { useState } from 'react';
import { Box, CssBaseline, Toolbar } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import Head from 'next/head';
import theme from '../../styles/theme/theme';
import Sidebar from './Sidebar';
import TopAppBar from './TopAppBar';

export default function DashboardLayout({ children }) {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <ThemeProvider theme={theme}>
            <Head>
                <title>Material Dashboard</title>
            </Head>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <TopAppBar onMenuClick={() => setMobileOpen(!mobileOpen)} />
                <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        p: 3,
                        width: { sm: `calc(100% - 240px)` }
                    }}
                >
                    <Toolbar />
                    {children}
                </Box>
            </Box>
        </ThemeProvider>
    );
}