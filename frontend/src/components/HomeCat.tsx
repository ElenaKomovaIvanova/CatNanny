import React, { useState } from 'react';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import RegisterForm from './RegisterForm';
import Profile from './Profile';
import {
    AppBar, Toolbar, Typography, Button, Menu, MenuItem, IconButton, Box
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import HomePage from "./HomePage";
import LoginPage from "./LoginPage";
import OrdersList from "./OrdersList";
import OrderForm from "./OrderForm";
import NanniesList from "./NanniesList";
import UnavailableDates from "./UnavailablePeriodForm";
import ReviewForm from "./ReviewForm";
import ReviewsList from "./ReviewsList";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { logoutUser } from "../redux/userSlice";

export const theme = createTheme({
    palette: {
        primary: { main: '#FFA552' },
        secondary: { main: '#381D2A' },
        text: { primary: '#381D2A' },
    },
    typography: {
        fontFamily: 'Arial, sans-serif',
        h6: { fontWeight: 700 },
    },
});

const HomeCat: React.FC = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const token = useSelector((state: RootState) => state.user.token);

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate('/login');
    };

    const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <ThemeProvider theme={theme}>
            <Box display="flex" flexDirection="column" minHeight="100vh">
                <AppBar position="static" color="primary">
                    <Toolbar>
                        <IconButton edge="start" sx={{ color: 'secondary.main' }} aria-label="menu"
                                    onClick={handleMenuClick}>
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Cat Nanny
                        </Typography>
                        <Box className="desktop-menu" sx={{ display: { xs: 'none', sm: 'flex' } }}>
                            <Button color="secondary" component={Link} to="/">
                                Home
                            </Button>
                            <Button color="secondary" component={Link} to="/nannies">
                                Nannies
                            </Button>
                            {token ? (
                                <>
                                    <Button color="secondary" component={Link} to="/orders">
                                        Orders
                                    </Button>
                                    <Button color="secondary" component={Link} to="/calendar">
                                        Calendar
                                    </Button>
                                    <Button color="secondary" component={Link} to="/review/list">
                                        My reviews
                                    </Button>
                                    <Button color="secondary" component={Link} to="/profile">
                                        Profile
                                    </Button>
                                    <Button color="secondary" onClick={handleLogout}>
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button color="secondary" component={Link} to="/register">
                                        Register
                                    </Button>
                                    <Button color="secondary" component={Link} to="/login">
                                        Login
                                    </Button>
                                </>
                            )}
                        </Box>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                        >
                            <MenuItem onClick={handleMenuClose} component={Link} to="/">
                                Home
                            </MenuItem>
                            <MenuItem onClick={handleMenuClose} component={Link} to="/nannies">
                                Nannies
                            </MenuItem>
                            {token ? (
                                <>
                                    <MenuItem onClick={handleMenuClose} component={Link} to="/profile">
                                        Profile
                                    </MenuItem>
                                    <MenuItem onClick={handleMenuClose} component={Link} to="/orders">
                                        Orders
                                    </MenuItem>
                                    <MenuItem onClick={handleMenuClose} component={Link} to="/calendar">
                                        Calendar
                                    </MenuItem>
                                    <MenuItem onClick={handleMenuClose} component={Link} to="/reviews">
                                        Reviews
                                    </MenuItem>
                                </>
                            ) : (
                                <>
                                    <MenuItem onClick={handleMenuClose} component={Link} to="/register">
                                        Register
                                    </MenuItem>
                                    <MenuItem onClick={handleMenuClose} component={Link} to="/login">
                                        Login
                                    </MenuItem>
                                </>
                            )}
                        </Menu>
                    </Toolbar>
                </AppBar>

                {/* Основное содержимое страницы */}
                <Box component="main" flexGrow={1}>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/register" element={<RegisterForm />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/orders" element={<OrdersList />} />
                        <Route path="/orders/:orderId" element={<OrderForm />} />
                        <Route path="/nannies" element={<NanniesList />} />
                        <Route path="nannies/profile/:id" element={<Profile />} />
                        <Route path="/orders/new" element={<OrderForm />} />
                        <Route path="/calendar" element={<UnavailableDates />} />
                        <Route path="/review/new" element={<ReviewForm />} />
                        <Route path="/review/list" element={<ReviewsList />} />
                        <Route path="/review/:id" element={<ReviewForm />} />
                    </Routes>
                </Box>

                {/* Футер */}
                <Box component="footer" bgcolor="primary.main" color="secondary.main" py={2} textAlign="center">
                    <Typography variant="body2">
                        &copy; {new Date().getFullYear()} Cat Nanny. All rights reserved.
                    </Typography>
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default HomeCat;
