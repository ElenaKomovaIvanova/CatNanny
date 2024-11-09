import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';


export interface ReviewData {
    id: number; // ID отзыва
    owner: {
        id: number; // ID пользователя, который оставил отзыв
        first_name: string; // Имя пользователя
        last_name: string; // Фамилия пользователя
    };
    catnanny: {
        id: number; // ID котоняни
        first_name: string; // Имя котоняни
        last_name: string; // Фамилия котоняни
    };
    review: string; // Текст отзыва
    rating: number; // Рейтинг от 1 до 10
    created_at: string; // Дата создания отзыва
}


// Асинхронное действие для получения отзывов
export const fetchUserReviews = createAsyncThunk(
    'reviews/fetchUserReviews',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.get('/api/reviews/list/', {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data; // Предполагается, что это массив отзывов
        } catch (error: any) {
            return rejectWithValue(error.response ? error.response.data : { error: 'Unexpected error occurred.' });
        }
    }
);

// Начальное состояние для отзывов
const initialState = {
    reviews: [] as ReviewData[],
    status: 'idle',
    error: null,
};

// Создаем слайс для отзывов
const reviewsSlice = createSlice({
    name: 'reviews',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserReviews.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUserReviews.fulfilled, (state, action: any) => {
                state.status = 'succeeded';
                state.reviews = action.payload.results; // Сохраняем отзывы в состояние
            })
            .addCase(fetchUserReviews.rejected, (state, action: PayloadAction<any>) => {
                state.status = 'failed';
                state.error = action.payload?.error || 'Failed to load reviews';
            });
    },
});

export default reviewsSlice.reducer;
