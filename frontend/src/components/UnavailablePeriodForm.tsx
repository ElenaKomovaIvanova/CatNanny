import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Box, Button, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../redux/store';
import { saveUnavailablePeriod, fetchUnavailablePeriods } from '../redux/calendarSlice';

const UnavailableDates: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();

    // Загружаем занятые даты из состояния
    const unavailablePeriods = useSelector((state: RootState) => state.calendar.unavailablePeriods);

    // Локальное состояние для выбранных начальной и конечной дат
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    // Загружаем занятые даты при загрузке компонента
    useEffect(() => {
        dispatch(fetchUnavailablePeriods());
    }, [dispatch]);

    // Обработчик выбора даты
    const handleDateSelect = (date: Date) => {
        if (!startDate || (startDate && endDate)) {
            setStartDate(date);
            setEndDate(null);
        } else if (startDate && !endDate) {
            if (date >= startDate) {
                setEndDate(date);
            } else {
                setStartDate(date);
            }
        }
    };

    // Обработчик отправки
    const handleSaveUnavailablePeriod = () => {
        if (startDate && endDate) {
            dispatch(saveUnavailablePeriod({
                start_date: startDate.toISOString().split('T')[0],
                end_date: endDate.toISOString().split('T')[0],
            }));
            setStartDate(null);
            setEndDate(null);
        }
    };

    // Функция для выделения занятых дат
    const tileClassName = ({ date, view }: any) => {
        if (view === 'month') {
            const isUnavailable = unavailablePeriods.some((period: { start_date: string; end_date: string }) => {
                const start = new Date(period.start_date);
                const end = new Date(period.end_date);
                return date >= start && date <= end;
            });
            return isUnavailable ? 'unavailable-date' : null;
        }
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            sx={{ minHeight: '100vh' }}
        >
            <Typography variant="h5" gutterBottom>
                Mark Unavailable Dates
            </Typography>
            <Calendar
                selectRange
                onClickDay={handleDateSelect}
                value={startDate && endDate ? [startDate, endDate] : startDate}
                tileClassName={tileClassName}
            />
            <Button
                variant="contained"
                color="primary"
                onClick={handleSaveUnavailablePeriod}
                disabled={!startDate || !endDate}
                sx={{ marginTop: 2, padding: '6px 12px' }}
                size="small"
            >
                Save Period
            </Button>
            <style>
                {`
                    .react-calendar {
                        width: 100%;
                        max-width: 400px;
                        background-color: #C9DAB7;
                        border-radius: 8px;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    }
                    .react-calendar__tile--active {
                        background: #FCDE9C
                        color: white;
                    }
                    .unavailable-date {
                        background-color: #FCDE9C !important;
                        color: #381D2A;
                    }
                `}
            </style>
        </Box>
    );
};

export default UnavailableDates;
