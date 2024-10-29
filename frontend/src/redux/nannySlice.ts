import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import axios from "axios";

// Profile data interface
interface Nanny {
    id: number;
    phone_number: string;
    bio: string;
    city: string;
    address: string;
    has_pets: boolean;
    has_children_under_10: boolean;
    pickup: boolean;
    visit: boolean;
    photo: string;
}

interface Nannies {
    nannies: Nanny[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: Nannies = {
    nannies: [],
    status: 'idle',
    error: null,
};

export const fetchNannies = createAsyncThunk(
    'profile/fetchNannies',
    async ({ startDate, endDate }: { startDate: string; endDate: string }, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.get('/api/nannies/', {
                params: { start_date: startDate, end_date: endDate },  // Передаем даты в качестве параметров запроса
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response ? error.response.data : { error: 'Unexpected error occurred.' }
            );
        }
    }
);
const nanniesSlice = createSlice({
    name: 'nannies',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchNannies.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchNannies.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.nannies = action.payload;
            })
            .addCase(fetchNannies.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch orders';
            });
    },
});

export default nanniesSlice.reducer;