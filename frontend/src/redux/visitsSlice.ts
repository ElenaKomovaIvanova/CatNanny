import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import logger from "redux-logger";

// Type for visit data
export interface VisitData {
    id?: number;
    catnanny: number;  // ID of the catnanny
    order: number;     // ID of the associated order
    date: string;      // Visit date
}

// Initial state
const initialState = {
    status: 'idle',
    error: null,
    visits: [] as VisitData[],
};

// Async action to fetch visits
export const fetchVisits = createAsyncThunk(
    'visits/fetchVisits',
    async (orderId: number, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.get('/api/visits/', {
                headers: { Authorization: `Bearer ${token}` },
                params: { order: orderId },
            });
            const data = response.data
            console.log(data)
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response ? error.response.data : { error: 'Failed to fetch visits' });
        }
    }
);

// Async action to create a visit
export const createVisit = createAsyncThunk(
    'visits/createVisit',
    async (visitData: VisitData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.post('/api/visits/', visitData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response ? error.response.data : { error: 'Failed to create visit' });
        }
    }
);

// Create the visits slice
const visitsSlice = createSlice({
    name: 'visits',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchVisits.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchVisits.fulfilled, (state, action: PayloadAction<any>) => {
                state.status = 'succeeded';
                const res = action.payload;
                state.visits = action.payload.results;
            })
            .addCase(fetchVisits.rejected, (state, action: PayloadAction<any>) => {
                state.status = 'failed';
                state.error = action.payload?.error || 'Failed to load visits';
            })
            .addCase(createVisit.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createVisit.fulfilled, (state, action: PayloadAction<VisitData>) => {
                state.status = 'succeeded';
                state.visits.push(action.payload); // Add new visit to the state
            })
            .addCase(createVisit.rejected, (state, action: PayloadAction<any>) => {
                state.status = 'failed';
                state.error = action.payload?.error || 'Failed to create visit';
            });
    },
});

export default visitsSlice.reducer;
