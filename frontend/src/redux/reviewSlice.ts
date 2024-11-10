import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
const apiUrl = process.env.REACT_APP_API_URL;
// Тип для данных ревью
export interface ReviewData {
    id?: number; // ID отзыва (может отсутствовать при создании)
    catnanny: number; // ID котоняни
    review: string;   // Текст ревью
    rating: number;   // Оценка от 1 до 10
}

// Тип для данных котоняни
export interface CatnannyData {
    id: number;
    first_name: string;
    last_name: string;
}

const initialState = {
    status: 'idle',
    error: null,
    catnannyData: null as CatnannyData | null, // Данные котоняни
    reviews: [] as ReviewData[], // Список отзывов
    currentReview: null as ReviewData | null, // Отзыв для редактирования
};

export const saveReview = createAsyncThunk(
    'reviews/saveReview',
    async (reviewData: ReviewData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('access_token');
            // Определяем метод и URL в зависимости от наличия ID
            const response = reviewData.id
                ? await axios.put(`${apiUrl}/api/reviews/${reviewData.id}/`, reviewData, {
                    headers: { Authorization: `Bearer ${token}` },
                }) // Обновление существующего отзыва
                : await axios.post('/api/reviews/new/', reviewData, {
                    headers: { Authorization: `Bearer ${token}` },
                }); // Создание нового отзыва
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response ? error.response.data : { error: 'Unexpected error occurred.' });
        }
    }
);

// Асинхронное действие для получения конкретного отзыва по ID
export const fetchReviewById = createAsyncThunk(
    'reviews/fetchReviewById',
    async (id: number, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.get(`${apiUrl}/api/reviews/${id}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data; // Предполагается, что это отзыв
        } catch (error: any) {
            return rejectWithValue(error.response ? error.response.data : { error: 'Failed to load review' });
        }
    }
);

// Создаем слайс для ревью
const reviewSlice = createSlice({
    name: 'reviews',
    initialState,
    reducers: {
        setCatnannyData(state, action: PayloadAction<CatnannyData>) {
            state.catnannyData = action.payload; // Сохраняем данные котоняни
        },
        clearCatnannyData(state) {
            state.catnannyData = null; // Очищаем данные котоняни
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(saveReview.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(saveReview.fulfilled, (state) => {
                state.status = 'succeeded';
            })
            .addCase(saveReview.rejected, (state, action: PayloadAction<any>) => {
                state.status = 'failed';
                state.error = action.payload?.error || 'Failed to save review';
            })
            .addCase(fetchReviewById.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchReviewById.fulfilled, (state, action: PayloadAction<ReviewData>) => {
                state.status = 'succeeded';
                state.currentReview = action.payload; // Сохраняем текущий отзыв для редактирования
            })
            .addCase(fetchReviewById.rejected, (state, action: PayloadAction<any>) => {
                state.status = 'failed';
                state.error = action.payload?.error || 'Failed to load review';
            });
    },
});

export const { setCatnannyData, clearCatnannyData } = reviewSlice.actions;
export default reviewSlice.reducer;
