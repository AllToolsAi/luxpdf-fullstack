// src/layouts/Sidebar.js
import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Toolbar // Add this import
} from '@mui/material';
import { Dashboard, People, BarChart, Layers } from '@mui/icons-material';
import { useRouter } from 'next/router';

const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/' },
    { text: 'Users', icon: <People />, path: '/users' },
    { text: 'Reports', icon: <BarChart />, path: '/reports' },
    { text: 'Integrations', icon: <Layers />, path: '/integrations' },
];

export default function Sidebar({ mobileOpen, onClose }) {
    const router = useRouter();

    return (
        <>
            {/* Mobile Drawer */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={onClose}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': {
                        width: 240,
                    },
                }}
            >
                <List>
                    {menuItems.map((item) => (
                        <ListItem
                            button
                            key={item.text}
                            selected={router.pathname === item.path}
                            onClick={() => router.push(item.path)}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>

            {/* Desktop Drawer */}
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    '& .MuiDrawer-paper': {
                        width: 240,
                        boxSizing: 'border-box',
                    },
                }}
                open
            >
                <Toolbar /> {/* Spacer for AppBar */}
                <List>
                    {menuItems.map((item) => (
                        <ListItem
                            button
                            key={item.text}
                            selected={router.pathname === item.path}
                            onClick={() => router.push(item.path)}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>
        </>
    );
}