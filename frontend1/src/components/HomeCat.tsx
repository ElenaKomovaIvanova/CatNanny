import React, { useState } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import RegisterForm from './RegisterForm';
import Profile from './Profile';
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem, IconButton } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import HomePage from "./HomePage";
import LoginPage from "./LoginPage";
import OrdersList from "./OrdersList";
import OrderForm from "./OrderForm";
import NanniesList from "./NanniesList";

// Create custom theme
export const theme = createTheme({
    palette: {
        primary: {
            main: '#FFA552', // Color for AppBar (background)
        },
        secondary: {
            main: '#381D2A', // Text and element color
        },
        text: {
            primary: '#381D2A', // Main text color
        },
    },
    typography: {
        fontFamily: 'Arial, sans-serif', // Font settings
        h6: {
            fontWeight: 700, // Increased header text weight
        },
    },
});

const HomeCat: React.FC = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget); // Open menu
    };

    const handleMenuClose = () => {
        setAnchorEl(null); // Close menu
    };

    return (
        <ThemeProvider theme={theme}> {/* Wrap application in ThemeProvider */}
            <div className="App">
                {/* Navigation bar with custom background color */}
                <AppBar position="static" color="primary">
                    <Toolbar>
                        <IconButton edge="start" sx={{ color: 'secondary.main' }} aria-label="menu" onClick={handleMenuClick}>
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Cat Nanny
                        </Typography>

                        {/* Navigation buttons */}
                        <Button color="secondary" component={Link} to="/">
                            Home
                        </Button>
                        <Button color="secondary" component={Link} to="/register">
                            Register
                        </Button>
                        <Button color="secondary" component={Link} to="/profile">
                            Profile
                        </Button>
                        <Button color="secondary" component={Link} to="/login">
                            Login
                        </Button>
                        <Button color="secondary" component={Link} to="/orders">
                            Orders
                        </Button>
                        <Button color="secondary" component={Link} to="/nannies">
                            Nannies
                        </Button>
                    </Toolbar>
                </AppBar>

                {/* Dropdown menu */}
                <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    <MenuItem onClick={handleMenuClose} component={Link} to="/">
                        Home
                    </MenuItem>
                    <MenuItem onClick={handleMenuClose} component={Link} to="/register">
                        Register
                    </MenuItem>
                    <MenuItem onClick={handleMenuClose} component={Link} to="/profile">
                        Profile
                    </MenuItem>
                    <MenuItem onClick={handleMenuClose} component={Link} to="/login">
                        Login
                    </MenuItem>
                    <MenuItem onClick={handleMenuClose} component={Link} to="/orders">
                        Orders
                    </MenuItem>
                    <MenuItem onClick={handleMenuClose} component={Link} to="/nannies">
                        Nannies
                    </MenuItem>
                </Menu>

                {/* Routes for pages */}
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/register" element={<RegisterForm />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/orders" element={<OrdersList />} />
                    <Route path="/orders/:orderId" element={<OrderForm />} />
                    <Route path="/nannies" element={<NanniesList />} />
                    <Route path="nannies/profile/:id" element={<Profile />} />
                </Routes>
            </div>
        </ThemeProvider>
    );
};

export default HomeCat;
