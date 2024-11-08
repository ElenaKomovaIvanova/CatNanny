import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {registerUser} from '../redux/userSlice';
import {RootState, AppDispatch} from '../redux/store';  // Import types
import {TextField, Button, Box, Typography, CircularProgress} from '@mui/material';
import {useNavigate} from "react-router-dom";  // Import MUI components

// Interface for form data
interface UserData {
    username: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
}


const RegisterForm: React.FC = () => {
    const [username, setUsername] = useState<string>('');  // Typing useState
    const [first_name, setFirstName] = useState<string>('');
    const [last_name, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const dispatch = useDispatch<AppDispatch>();  // Typing dispatch
    const navigate = useNavigate();

    // Get status and error from Redux state
    const {status, error} = useSelector((state: RootState) => state.user);

    useEffect(() => {
        if (status === 'succeeded') {
            navigate('../nannies/');
        }
    }, [status]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const userData: UserData = {username, email, password, first_name, last_name};  // Typing form data
        dispatch(registerUser(userData));
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{maxWidth: 400, margin: 'auto', padding: 2}}>
            <Typography variant="h4" gutterBottom>
                Register
            </Typography>
            <TextField
                fullWidth
                label="Username"
                variant="outlined"
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
                fullWidth
                label="First Name"
                variant="outlined"
                margin="normal"
                value={first_name}
                onChange={(e) => setFirstName(e.target.value)}
            />
            <TextField
                fullWidth
                label="Last Name"
                variant="outlined"
                margin="normal"
                value={last_name}
                onChange={(e) => setLastName(e.target.value)}
            />
            <TextField
                fullWidth
                label="Email"
                variant="outlined"
                margin="normal"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                Register
            </Button>
            {status === 'succeeded' && <Typography color="success.main">User was created.</Typography>}
            {status === 'loading' && <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>}
            {status === 'failed' && <Typography color="error.main"> {error} </Typography>}
        </Box>
    );
};

export default RegisterForm;
