// src/features/orders/ordersSlice.ts
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import axiosInstance from "./axiosInstance";

const apiUrl = process.env.REACT_APP_API_URL;
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

export const fetchOrders = createAsyncThunk(
    'orders/fetchOrders',
    async (_, { rejectWithValue }) => {  // исправляем синтаксис
        try {
            const token = localStorage.getItem('access_token');
            const response = await axiosInstance.get(`${apiUrl}/api/orders/`, {
                headers: {
                    Authorization: `Bearer ${token}`, // Добавляем токен в заголовок
                },
            });
            return response.data.results as Order[];
        } catch (error: any) {
            return rejectWithValue(
                error.response ? error.response.data : { error: 'Failed to load orders' }
            );
        }
    }
);


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
