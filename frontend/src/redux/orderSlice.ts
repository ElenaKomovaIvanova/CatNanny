import {createSlice, PayloadAction, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import axiosInstance from "./axiosInstance";

const apiUrl = process.env.REACT_APP_API_URL;
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
    current_status: string | null;
    allowed_statuses?: string[]; // new field for allowed statuses
}

// Define the interface for the form state
export interface OrderFormState {
    request: OrderData;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

// Async thunk for creating a request
export const createOrder = createAsyncThunk(
    'request/createOrder',
    async (requestData: OrderData, {rejectWithValue}) => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await axiosInstance.post(`${apiUrl}/api/orders/new/`, requestData, {
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

export const fetchOrder = createAsyncThunk(
    'request/fetchRequest',
    async (orderId: string, {rejectWithValue}) => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await axiosInstance.get(`${apiUrl}/api/orders/${orderId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = response.data;
            return data as OrderData;
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
            const response = await axiosInstance.put(`${apiUrl}/api/orders/${id}/`, requestData, {
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
        message: '',
        current_status: '',
        allowed_statuses: [] // initializing empty
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
            .addCase(createOrder.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(createOrder.fulfilled, (state, action: PayloadAction<OrderData>) => {
                state.status = 'succeeded';
                state.request = action.payload;
            })
            .addCase(createOrder.rejected, (state, action: PayloadAction<any>) => {
                state.status = 'failed';
                const payload = action.payload;
                if (payload && typeof payload === 'object') {
                    // Объединяем ошибки в читаемую строку
                    state.error = Object.entries(payload)
                        .map(([field, errors]) => `${field}: ${(errors as string[]).join(', ')}`)
                        .join('\n');
                } else {
                    state.error = 'Failed to create request';
                }
                console.log(action.payload); // Для отладки

            })
            .addCase(fetchOrder.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchOrder.fulfilled, (state, action: PayloadAction<OrderData>) => {
                state.status = 'succeeded';
                state.request = action.payload;
                state.request.allowed_statuses = action.payload.allowed_statuses || [];
            })
            .addCase(fetchOrder.rejected, (state, action: PayloadAction<any>) => {
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
