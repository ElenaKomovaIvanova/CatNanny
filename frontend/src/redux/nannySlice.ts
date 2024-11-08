import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
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
    first_name: string;
    last_name: string;
    average_rating: number;
}

interface NanniesState {
    nannies: Nanny[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    nextOffset: number | null;  // Добавляем поле для хранения следующего смещения
}

const initialState: NanniesState = {
    nannies: [],
    status: 'idle',
    error: null,
    nextOffset: 0,
};

// Обновляем fetchNannies для поддержки смещения и бесконечной прокрутки
export const fetchNannies = createAsyncThunk(
    'profile/fetchNannies',
    async (
        { startDate, endDate, offset }: { startDate: string; endDate: string; offset: number },
        { rejectWithValue }
    ) => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.get('/api/nannies/', {
                params: { start_date: startDate, end_date: endDate, limit: 10, offset },
                headers: { Authorization: `Bearer ${token}` },
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
    reducers: {
        resetNannies: (state) => {
            state.nannies = [];
            state.status = 'idle';
            state.error = null;
            state.nextOffset = 0;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNannies.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchNannies.fulfilled, (state, action: PayloadAction<{ results: Nanny[]; next: string | null }>) => {
                state.status = 'succeeded';

                // Добавляем новых нянь к существующему списку
                state.nannies = [...state.nannies, ...action.payload.results];

                // Устанавливаем nextOffset на новое смещение или null, если больше данных нет
                state.nextOffset = action.payload.next ? state.nannies.length : null;
            })
            .addCase(fetchNannies.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch nannies';
            });
    },
});

export const { resetNannies } = nanniesSlice.actions;
export default nanniesSlice.reducer;
