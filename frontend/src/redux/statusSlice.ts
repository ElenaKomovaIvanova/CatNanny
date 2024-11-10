import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import {OrderData} from "./orderSlice";

const apiUrl = process.env.REACT_APP_API_URL;
interface Status {
    order_id: number;
    status_order: string;
}

export const updateOrderStatus = createAsyncThunk(
    'orders/updateOrderStatus',
    async (requestData: Status, {rejectWithValue}) => {
        console.log(requestData)
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.post(`${apiUrl}/api/orders/updateStatus/`, requestData, {
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