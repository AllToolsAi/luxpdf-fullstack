// components/Navbar.js
import { AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

export default function Navbar() {
    return (
        <AppBar position="fixed">
            <Toolbar>
                <IconButton edge="start" color="inherit">
                    <MenuIcon />
                </IconButton>
                <Typography variant="h6">Material Dashboard</Typography>
            </Toolbar>
        </AppBar>
    );
}