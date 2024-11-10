import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
const apiUrl = process.env.REACT_APP_API_URL;
export interface ChatMessage {
    id: number;               // Уникальный идентификатор сообщения
    order: number;            // Идентификатор заказа, к которому относится сообщение
    sender: number;           // Идентификатор отправителя (профиля)
    message: string;          // Текст сообщения
    timestamp: string;        // Время отправки сообщения
    sender_name: string;
}

interface ChatState {
    messages: ChatMessage[];
}

const initialState: ChatState = {
    messages: [],
};

// Асинхронное действие для загрузки сообщений из API
export const fetchMessages = createAsyncThunk<ChatMessage[], number>(
    'chat/fetchMessages',
    async (orderId) => {
        const response = await fetch(`${apiUrl}/api/chat/messages/${orderId}/`);  // Убедитесь, что путь совпадает
        if (!response.ok) {
            throw new Error("Failed to fetch messages");
        }
        const data = await response.json();
        return data;
    }
);

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        addMessage: (state, action: PayloadAction<ChatMessage>) => {
            state.messages.push(action.payload);
        },
        setMessages: (state, action: PayloadAction<ChatMessage[]>) => {
            state.messages = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchMessages.fulfilled, (state, action) => {
            state.messages = action.payload;  // Устанавливаем полученные сообщения в state.messages
        });
    },
});

export const { addMessage, setMessages } = chatSlice.actions;
export default chatSlice.reducer;
