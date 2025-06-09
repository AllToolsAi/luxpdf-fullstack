// src/theme/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#7b1fa2',
            light: '#ae52d4',
            dark: '#4a0072',
        },
        secondary: {
            main: '#ff4081',
            light: '#ff79b0',
            dark: '#c60055',
        },
        background: {
            default: '#f5f5f5',
            paper: '#ffffff',
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h1: { fontSize: '2.5rem', fontWeight: 700 },
        h2: { fontSize: '2rem', fontWeight: 700 },
        h3: { fontSize: '1.75rem', fontWeight: 500 },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    boxShadow: '0 4px 18px 0px rgba(0, 0, 0, 0.12)',
                },
            },
        },
    },
});

export default theme;