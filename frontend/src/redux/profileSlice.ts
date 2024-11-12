import {createSlice, PayloadAction, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import axiosInstance from "./axiosInstance";
const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

// Profile data interface
interface ProfileData {
    phone_number: string;
    bio: string;
    city: string;
    address: string;
    has_pets: boolean;
    has_children_under_10: boolean;
    pickup: boolean;
    visit: boolean;
    photo: File;
    is_catnanny: boolean;
    is_pet_owner: boolean;
    user_id:string;
    first_name: string; // добавляем имя
    last_name: string;
}

// Profile state interface
interface ProfileState {
    profile: ProfileData | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: ProfileState = {
    profile: null,
    status: 'idle',
    error: null,
};

// Helper function to recursively flatten error messages
function flattenErrorMessages(details: any, parentKey = ''): string {
    let messages: string[] = [];

    Object.keys(details).forEach((key) => {
        const value = details[key][0];
        const fullKey = parentKey ? `${parentKey}.${key}` : key;

        if (typeof value === 'object' && value !== null) {
            // Recursively flatten nested objects
            messages.push(flattenErrorMessages(value, fullKey));
        } else {
            // Collect key and message as a single string
            messages.push(`${fullKey}: ${value}`);
        }
    });

    return messages.join('; ');
}

// Async thunk for updating profile
export const updateProfile = createAsyncThunk(
    'profile/updateProfile',
    async (profileData: FormData, {rejectWithValue}) => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await axiosInstance.put(`${REACT_APP_API_URL}/api/profile/update/`, profileData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response ? error.response.data : {error: 'Unexpected error occurred.'});
        }
    }
);

// Async thunk for fetching profile
export const fetchProfile = createAsyncThunk(
    'profile/fetchProfile',
    async ({ id }: { id?: string }, { rejectWithValue }) => {
        const token = localStorage.getItem('access_token');
        const url = id ? `${REACT_APP_API_URL}/api/profile/${id}/` : '/api/profile/';

        try {
            const headers: any = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await axiosInstance.get(url, { headers });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response ? error.response.data : { error: 'Unexpected error occurred.' });
        }
    }
);


// Slice for user profile
const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(updateProfile.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(updateProfile.fulfilled, (state, action: PayloadAction<ProfileData>) => {
                state.status = 'succeeded';
                state.profile = action.payload;
            })
            .addCase(updateProfile.rejected, (state, action: PayloadAction<any>) => {
                state.status = 'failed';
                const errorMessage = action.payload?.error || 'Failed to update profile';
                let detailsMessage = '';
                if (action.payload?.details) {
                    if (typeof action.payload.details === 'object') {
                        detailsMessage = flattenErrorMessages(action.payload.details);
                    } else {
                        detailsMessage = action.payload.details;
                    }
                }

                state.error = `${errorMessage}${detailsMessage ? ` ${detailsMessage}` : ''}`;
            })
            .addCase(fetchProfile.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchProfile.fulfilled, (state, action: PayloadAction<ProfileData>) => {
                state.status = 'succeeded';
                state.profile = action.payload;
            })
            .addCase(fetchProfile.rejected, (state, action: PayloadAction<any>) => {
                state.status = 'failed';
                state.error = action.payload?.error || 'Failed to fetch profile';
            });

    },
});

export default profileSlice.reducer;
