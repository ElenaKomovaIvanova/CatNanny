import React, { useState } from 'react';
import {AppDispatch} from '../redux/store';

import {
    TextField,
    Button,
    Typography,
    Box,
} from '@mui/material';
import {createVisit} from "../redux/visitsSlice";
import {useDispatch} from "react-redux";

interface VisitFormProps {
    catnannyId: number;  // ID котоняни
    orderId: number;     // ID заказа
    startDate: string;   // Дата начала из заказа
    endDate: string;     // Дата окончания из заказа
    currentUserProfileId: number;
}

const VisitForm: React.FC<VisitFormProps> = ({ catnannyId, orderId, startDate, endDate, currentUserProfileId}) => {
    const dispatch = useDispatch<AppDispatch>();
    const [date, setDate] = useState('');

    const handleOnClick = async (e: React.FormEvent) => {
        e.preventDefault();
        if (date) {
            const visitData = {
                catnanny: catnannyId,
                order: orderId,
                date,
            };
            try {
                await dispatch(createVisit(visitData)); // Диспатч действия создания визита
                setDate(''); // Очищаем поле даты после отправки
            } catch (error) {
                console.error("Ошибка при создании визита:", error);
            }
        }
    };

    if (catnannyId !== currentUserProfileId) {
        return null; // Не отображаем форму, если пользователь котоняня
    }

    return (
        <Box sx={{ margin: '20px 0' }}>
            <Typography variant="h6" gutterBottom>Add a Visit</Typography>
            <TextField
                label="Visit Date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                inputProps={{
                    min: startDate,
                    max: endDate,
                }}
            />
            <Button type="button" variant="contained" color="primary" onClick={handleOnClick}>
                Create Visit
            </Button>
        </Box>
    );
};

export default VisitForm;
