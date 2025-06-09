// pages/dashboard.js
import { Box, Container } from '@mui/material';
import Navbar from '../components/Navbar';
import DashboardChart from '../components/DashboardChart';

export default function Dashboard() {
    return (
        <Box sx={{ display: 'flex' }}>
            <Navbar />
            <Container maxWidth="lg" sx={{ mt: 10 }}>
                <DashboardChart />
                {/* Add more components here */}
            </Container>
        </Box>
    );
}