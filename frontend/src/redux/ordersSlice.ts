// src/features/orders/ordersSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


interface Order {
    id: number;
    start_date: string;
    end_date: string;
    current_status: string | null;
}

interface OrdersState {
    orders: Order[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: OrdersState = {
    orders: [],
    status: 'idle',
    error: null,
};

export const fetchOrders = createAsyncThunk('orders/fetchOrders', async () => {
    const token = localStorage.getItem('access_token');
    const response = await axios.get('/api/orders/', {
        headers: {
            Authorization: `Bearer ${token}`, // Добавляем токен в заголовок
        },
    });
    return response.data.results as Order[];
});

const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrders.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.orders = action.payload;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Failed to fetch orders';
            });
    },
});

export default ordersSlice.reducer;
