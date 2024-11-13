import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { addMessage, fetchMessages, ChatMessage } from '../redux/chatSlice';
import {
    TextField,
    Button,
    Typography,
    Box,
    Paper,
    IconButton,
    Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

interface ChatProps {
    orderId: number;
    currentUserProfileId: number;
}

const REACT_APP_WEBSOCKET_URL = process.env.REACT_APP_WEBSOCKET_URL;

const Chat: React.FC<ChatProps> = ({ orderId, currentUserProfileId }) => {
    const dispatch = useDispatch<AppDispatch>();
    const messages = useSelector((state: RootState) => state.chat.messages);
    const [chatMessage, setChatMessage] = useState<string>('');
    const [isOpen, setIsOpen] = useState<boolean>(true);
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        // Загружаем сообщения из базы данных при первой загрузке компонента
        dispatch(fetchMessages(orderId));

        // Создаем WebSocket соединение
        const newSocket = new WebSocket(`${REACT_APP_WEBSOCKET_URL}/ws/order_chat/${orderId}/`);

        newSocket.onopen = () => {
            console.log("WebSocket connection opened");
        };

        newSocket.onclose = () => {
            console.log("WebSocket connection closed");
        };

        newSocket.onerror = (error) => {
            console.error("WebSocket error observed:", error);
        };

        newSocket.onmessage = (event) => {
            const message: ChatMessage = JSON.parse(event.data);
            console.log("Received message:", message);
            dispatch(addMessage(message));
        };

        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, [dispatch, orderId]);

    const handleChatMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setChatMessage(e.target.value);
    };

    const handleSendChatMessage = () => {
        if (chatMessage.trim() === '' || !socket || socket.readyState !== WebSocket.OPEN) {
            console.error("WebSocket is not open. Current state:", socket?.readyState);
            return;
        }

        const newMessage: ChatMessage = {
            id: Date.now(),
            order: orderId,
            sender: currentUserProfileId,
            message: chatMessage,
            timestamp: new Date().toISOString(),
            sender_name:'',
        };

        socket.send(JSON.stringify(newMessage));
        setChatMessage('');
    };

    return (
        <Paper
            elevation={3}
            style={{
                position: 'fixed',
                bottom: 20,
                right: 20,
                width: isOpen ? '300px' : '60px',
                transition: 'width 0.3s',
                borderRadius: '8px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {isOpen && (
                <Box sx={{ padding: 2 }}>
                    <Typography variant="h6">Chat Messages</Typography>
                    <Divider sx={{ margin: '8px 0' }} />
                    <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {messages
                            .filter(msg => msg.order === orderId)
                            .map(msg => (
                                <div key={msg.id}>
                                    <strong>{msg.sender_name}:</strong> {msg.message} <em>{new Date(msg.timestamp).toLocaleTimeString()}</em>
                                </div>
                            ))}
                    </div>
                    <TextField
                        label="Chat Message"
                        value={chatMessage}
                        onChange={handleChatMessageChange}
                        multiline
                        rows={2}
                        fullWidth
                        margin="normal"
                    />
                    <Button
                        type="button"
                        variant="contained"
                        color="primary"
                        onClick={handleSendChatMessage}
                    >
                        Send Message
                    </Button>
                </Box>
            )}

            <IconButton
                onClick={() => setIsOpen(prev => !prev)}
                sx={{
                    alignSelf: 'flex-end',
                    marginBottom: '8px',
                    backgroundColor: 'primary.main',
                    color: 'white',
                }}
            >
                {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
        </Paper>
    );
};

export default Chat;
