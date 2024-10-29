import {createSlice, PayloadAction, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';


// Define interfaces for the form fields
export interface OrderData {
    catnanny_first_name: string;
    catnanny_last_name: string;
    catnanny: string;
    cat_name: string;
    cat_gender: 'M' | 'F';
    cat_weight: number;
    cat_age: number;
    start_date: string;
    end_date: string;
    stay_type: 'pickup' | 'visit';
    message?: string;
}

// Define the interface for the form state
export interface OrderFormState {
    request: OrderData;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

// Async thunk for creating a request
export const createRequest = createAsyncThunk(
    'request/createRequest',
    async (requestData: OrderData, {rejectWithValue}) => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.post('/api/requests/', requestData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response ? error.response.data : {error: 'Unexpected error occurred.'});
        }
    }
);

export const fetchRequest = createAsyncThunk(
    'request/fetchRequest',
    async (orderId: string, {rejectWithValue}) => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.get(`/api/orders/${orderId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data as OrderData;
        } catch (error: any) {
            return rejectWithValue(error.response ? error.response.data : {error: 'Failed to fetch request data.'});
        }
    }
);

export const updateRequest = createAsyncThunk(
    'request/updateRequest',
    async ({id, ...requestData}: OrderData & { id: string }, {rejectWithValue}) => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.put(`/api/requests/${id}/`, requestData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data as OrderData;
        } catch (error: any) {
            return rejectWithValue(error.response ? error.response.data : {error: 'Failed to update request data.'});
        }
    }
);

const initialState: OrderFormState = {
    request: {
        catnanny_first_name: '',
        catnanny_last_name: '',
        catnanny: '',
        cat_name: 'Cat name',
        cat_gender: 'M',
        cat_weight: 0,
        cat_age: 0,
        start_date: '',
        end_date: '',
        stay_type: 'pickup',
        message: ''
    },
    status: 'idle',
    error: null,
};

const orderSlice = createSlice({
    name: 'request',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createRequest.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(createRequest.fulfilled, (state, action: PayloadAction<OrderData>) => {
                state.status = 'succeeded';
                state.request = action.payload;
            })
            .addCase(createRequest.rejected, (state, action: PayloadAction<any>) => {
                state.status = 'failed';
                state.error = action.payload?.error || 'Failed to create request';
            })
            .addCase(fetchRequest.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchRequest.fulfilled, (state, action: PayloadAction<OrderData>) => {
                state.status = 'succeeded';
                state.request = action.payload;
            })
            .addCase(fetchRequest.rejected, (state, action: PayloadAction<any>) => {
                state.status = 'failed';
                state.error = action.payload?.error || 'Failed to fetch request data';
            })
            .addCase(updateRequest.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(updateRequest.fulfilled, (state, action: PayloadAction<OrderData>) => {
                state.status = 'succeeded';
                state.request = action.payload;
            })
            .addCase(updateRequest.rejected, (state, action: PayloadAction<any>) => {
                state.status = 'failed';
                state.error = action.payload?.error || 'Failed to update request';
            });
    },
});

export default orderSlice.reducer;
