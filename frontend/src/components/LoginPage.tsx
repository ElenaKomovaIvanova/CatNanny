// src/components/LoginForm.tsx
import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {loginUser} from '../redux/userSlice'; // Import login action
import {RootState, AppDispatch} from '../redux/store'; // Import types
import {TextField, Button, Box, Typography} from '@mui/material'; // Import MUI components

// Interface for form data
interface LoginData {
    username: string; // Keep username
    password: string;
}

const LoginForm: React.FC = () => {
    const [username, setUsername] = useState<string>(''); // Typing useState
    const [password, setPassword] = useState<string>('');
    const dispatch = useDispatch<AppDispatch>(); // Typing dispatch

    // Get status and error from Redux state
    const {status} = useSelector((state: RootState) => state.user);
    const {error} = useSelector((state: RootState) => state.user);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const loginData: LoginData = {username, password}; // Typing form data
        dispatch(loginUser(loginData)); // Call login action
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{maxWidth: 400, margin: 'auto', padding: 2}}>
            <Typography variant="h4" gutterBottom>
                Login
            </Typography>
            <TextField
                fullWidth
                label="Username" // Use username
                variant="outlined"
                margin="normal"
                type="text" // Text type
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
                fullWidth
                label="Password"
                variant="outlined"
                margin="normal"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Button
                fullWidth
                type="submit"
                variant="contained"
                color="primary"
                sx={{marginTop: 2}}
            >
                Login
            </Button>
            {status === 'succeeded' && <Typography color="success.main">Login successful...</Typography>}
            {status === 'loading' && <Typography color="primary.main">Logging in...</Typography>}
            {status === 'failed' && <Typography color="error.main">{error}...</Typography>}
        </Box>
    );
};

export default LoginForm;
