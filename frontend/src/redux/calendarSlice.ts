import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Типы для данных недоступного периода
export interface UnavailablePeriodData {
    start_date: string;
    end_date: string;
}

// Асинхронное действие для загрузки недоступных периодов
export const fetchUnavailablePeriods = createAsyncThunk(
    'calendar/fetchUnavailablePeriods',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.get('/api/calendarAvailable/unavailable_periods/list', {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response ? error.response.data : { error: 'Unexpected error occurred.' });
        }
    }
);

// Асинхронное действие для сохранения недоступного периода
export const saveUnavailablePeriod = createAsyncThunk(
    'calendar/saveUnavailablePeriod',
    async (periodData: UnavailablePeriodData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.post('/api/calendarAvailable/unavailable_periods/', periodData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response ? error.response.data : { error: 'Unexpected error occurred.' });
        }
    }
);

// Начальное состояние для календаря
const initialState = {
    status: 'idle',
    error: null,
    unavailablePeriods: [] as UnavailablePeriodData[],
};

// Создаем слайс календаря
const calendarSlice = createSlice({
    name: 'calendar',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUnavailablePeriods.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUnavailablePeriods.fulfilled, (state, action: PayloadAction<UnavailablePeriodData[]>) => {
                state.status = 'succeeded';
                state.unavailablePeriods = action.payload;  // Сохраняем занятые даты в состояние
            })
            .addCase(fetchUnavailablePeriods.rejected, (state, action: PayloadAction<any>) => {
                state.status = 'failed';
                state.error = action.payload?.error || 'Failed to load unavailable periods';
            })
            .addCase(saveUnavailablePeriod.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(saveUnavailablePeriod.fulfilled, (state, action: PayloadAction<UnavailablePeriodData>) => {
                state.status = 'succeeded';
                state.unavailablePeriods.push(action.payload);  // Добавляем новую недоступную дату
            })
            .addCase(saveUnavailablePeriod.rejected, (state, action: PayloadAction<any>) => {
                state.status = 'failed';
                state.error = action.payload?.error || 'Failed to save unavailable period';
            });
    },
});

export default calendarSlice.reducer;
