import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface ErrorPayload {
    error: string;
    details?: string;
}

interface UserData {
    username: string;
    email: string;
    password: string;
}

interface UserDataLogin {
    username: string;
    email: string;
    access: string;
    refresh: string;
    profile_id: string;
}

interface Token {
    access: string;
    refresh: string;
}

interface UserState {
    user: UserDataLogin | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    token: Token | null;
}

const getToken = (): Token | null => {
    const refresh = localStorage.getItem('refresh_token');
    const access = localStorage.getItem('access_token');
    if (refresh && access) {
        return {
            access,
            refresh,
        };
    }
    return null;
}


const initialState: UserState = {
    user: null,
    status: 'idle',
    error: null,
    token: getToken(),
};

// Действие для регистрации
export const registerUser = createAsyncThunk<UserDataLogin, UserData, { rejectValue: ErrorPayload }>(
    'user/register',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post('/api/register/', userData);
            const data: UserDataLogin = response.data;
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response && error.response.data
                    ? error.response.data
                    : { error: 'Unexpected error occurred.' }
            );
        }
    }
);

// Действие для логина
export const loginUser = createAsyncThunk<UserDataLogin, { username: string; password: string }, { rejectValue: ErrorPayload }>(
    'user/login',
    async (loginData, { rejectWithValue }) => {
        try {
            const response = await axios.post('/api/login/', loginData);
            const data: UserDataLogin = response.data;
            localStorage.setItem('access_token', data.access);
            localStorage.setItem('refresh_token', data.refresh);
            localStorage.setItem('profile_id', data.profile_id);
            return data;
        } catch (error: any) {
            return rejectWithValue(
                error.response && error.response.data
                    ? error.response.data
                    : { error: 'Unexpected error occurred.' }
            );
        }
    }
);

// Действие для логаута
export const logoutUser = createAsyncThunk<void, void, { rejectValue: ErrorPayload }>(
    'user/logout',
    async (_, { rejectWithValue }) => {
        try {
            const refreshToken = localStorage.getItem('refresh_token');
            await axios.post('/api/logout/', { refresh_token: refreshToken });
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('profile_id');
        } catch (error: any) {
            return rejectWithValue(
                error.response && error.response.data
                    ? error.response.data
                    : { error: 'Unexpected error occurred during logout.' }
            );
        }
    }
);

const cleanErrorString = (errorString: string): string => {
    return errorString
        .replace(/^Validation error:\s*\{|\}\s*$/g, '') // Убираем префикс и крайние фигурные скобки
        .replace(/ErrorDetail\(string='(.*?)',\s*code='.*?'\)/g, '$1') // Извлекаем текст ошибки
        .replace(/['"\[\]]/g, '') // Убираем кавычки и квадратные скобки
        .replace(/,\s*(\w+:)/g, '; $1') // Заменяем запятые на "; " между ошибками
        .trim(); // Убираем лишние пробелы в начале и конце строки
};


const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(registerUser.fulfilled, (state, action: PayloadAction<UserDataLogin>) => {
                state.token = getToken();
                state.status = 'succeeded';
                state.user = action.payload;
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.status = 'failed';
                const payload = action.payload as ErrorPayload;
                state.error = payload
                    ? `${payload.error}${payload.details ? `: ${cleanErrorString(payload.details)}` : ''}`
                    : 'Failed to register';
            })
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<UserDataLogin>) => {
                state.token = getToken();
                state.status = 'succeeded';
                state.user = action.payload;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                const payload = action.payload as ErrorPayload;
                state.error = payload
                    ? `${payload.error}${payload.details ? `: ${payload.details}` : ''}`
                    : 'Login failed';
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.token = null;
                state.status = 'idle';
                state.user = null;
                state.error = null;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.status = 'failed';
                const payload = action.payload as ErrorPayload;
                state.error = payload
                    ? `${payload.error}${payload.details ? `: ${payload.details}` : ''}`
                    : 'Logout failed';
            });
    },
});

export default userSlice.reducer;
