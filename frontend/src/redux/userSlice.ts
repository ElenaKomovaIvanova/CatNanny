import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface ErrorPayload {
    error: string;
    details?: string;
}
// Interface for user registration data
interface UserData {
    username: string;
    email: string;
    password: string;
}

// Interface for data returned after registration (with tokens)
interface UserDataLogin {
    username: string;
    email: string;
    access: string;  // Access token
    refresh: string; // Refresh token
}

// Interface for error structure
interface ErrorPayload {
    error: string;
    details?: string;
}

// Interface for userSlice state
interface UserState {
    user: UserDataLogin | null;  // Store token data after registration
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

// Initial state
const initialState: UserState = {
    user: null,
    status: 'idle',
    error: null,
};

// Async operation for user registration
export const registerUser = createAsyncThunk<UserDataLogin, UserData, { rejectValue: ErrorPayload }>(
    'user/register',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post('/api/register/', userData);
            const data: UserDataLogin = response.data;  // Expecting token data
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response && error.response.data
                    ? error.response.data
                    : { error: 'Unexpected error occurred.' }
            );
        }
    }
);

// Async operation for user login
export const loginUser = createAsyncThunk<UserDataLogin, { username: string; password: string }, { rejectValue: ErrorPayload }>(
    'user/login',
    async (loginData, { rejectWithValue }) => {
        try {
            const response = await axios.post('/api/login/', loginData);
            const data: UserDataLogin = response.data;
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response && error.response.data
                    ? error.response.data
                    : { error: 'Unexpected error occurred.' }
            );
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(registerUser.fulfilled, (state, action: PayloadAction<UserDataLogin>) => {
                state.status = 'succeeded';
                state.user = action.payload;  // Save token data
                state.error = null;  // Clear any previous error
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.status = 'failed';
                const payload = action.payload as ErrorPayload;
                state.error = payload
                    ? `${payload.error}${payload.details ? `: ${payload.details}` : ''}`
                    : 'Failed to register';
            })
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<UserDataLogin>) => {
                state.status = 'succeeded';
                state.user = action.payload;  // Save token data
                state.error = null;  // Clear any previous error
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                const payload = action.payload as ErrorPayload;
                state.error = payload
                    ? `${payload.error}${payload.details ? `: ${payload.details}` : ''}`
                    : 'Login failed';
            });
    },
});

export default userSlice.reducer;
