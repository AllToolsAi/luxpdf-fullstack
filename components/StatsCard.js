// src/components/StatsCard.js
import { Card, CardContent, Typography, Box } from '@mui/material';

export default function StatsCard({ icon, title, value, subtitle }) {
    return (
        <Card>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ mr: 2 }}>{icon}</Box>
                    <Box>
                        <Typography color="textSecondary" gutterBottom>
                            {title}
                        </Typography>
                        <Typography variant="h5">{value}</Typography>
                        <Typography color="textSecondary">{subtitle}</Typography>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
}