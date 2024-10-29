import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../redux/store';
import {createRequest, fetchRequest, OrderData, updateRequest} from '../redux/orderSlice';
import {TextField, Button, MenuItem, Typography, Box} from '@mui/material';
import {useParams, useNavigate} from 'react-router-dom';

const OrderForm: React.FC = () => {
    const {orderId} = useParams<{ orderId?: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const {status, error} = useSelector((state: RootState) => state.request);
    const [formData, setFormData] = useState<OrderData>({
        catnanny_first_name: '',
        catnanny_last_name:'',
        catnanny: '',
        cat_name: '',
        cat_gender: 'M',
        cat_weight: 0,
        cat_age: 0,
        start_date: '',
        end_date: '',
        stay_type: 'pickup',
        message: '',
    });

    // Загрузка данных заявки для редактирования
    useEffect(() => {
        if (orderId) {
            dispatch(fetchRequest(orderId)).then((response: any) => {
                if (response.payload) {
                    setFormData(response.payload);
                }
            });
        }
    }, [orderId, dispatch]);

    // Обработка изменений в полях формы
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Обработка отправки формы
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (orderId) {
            dispatch(updateRequest({id: orderId, ...formData})).then(() => {
                navigate('/orders'); // Переход на страницу со списком заказов
            });
        } else {
            dispatch(createRequest(formData)).then(() => {
                navigate('/orders');
            });
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{maxWidth: 400, margin: 'auto', padding: 2}}>
            <Typography variant="h4" gutterBottom>
                {orderId ? `Order N${orderId}` : 'New Order'}
            </Typography>

            <TextField
                label="Catnanny"
                name="catnanny"
                value={`${formData.catnanny_first_name} ${formData.catnanny_last_name}`.trim()}  // Устанавливаем пустую строку, если значение undefined
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Cat Name"
                name="cat_name"
                value={formData.cat_name ?? ''}  // Устанавливаем пустую строку, если значение undefined
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                select
                label="Cat Gender"
                name="cat_gender"
                value={formData.cat_gender ?? 'M'}  // Устанавливаем значение 'M' по умолчанию
                onChange={handleChange}
                fullWidth
                margin="normal"
            >
                <MenuItem value="M">Male</MenuItem>
                <MenuItem value="F">Female</MenuItem>
            </TextField>
            <TextField
                label="Cat Weight (kg)"
                name="cat_weight"
                type="number"
                value={formData.cat_weight ?? 0}  // Устанавливаем 0, если значение undefined
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Cat Age (years)"
                name="cat_age"
                type="number"
                value={formData.cat_age ?? 0}  // Устанавливаем 0, если значение undefined
                onChange={handleChange}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Start Date"
                name="start_date"
                type="date"
                value={formData.start_date ?? ''}  // Устанавливаем пустую строку, если значение undefined
                onChange={handleChange}
                fullWidth
                margin="normal"
                InputLabelProps={{shrink: true}}
            />
            <TextField
                label="End Date"
                name="end_date"
                type="date"
                value={formData.end_date ?? ''}  // Устанавливаем пустую строку, если значение undefined
                onChange={handleChange}
                fullWidth
                margin="normal"
                InputLabelProps={{shrink: true}}
            />
            <TextField
                select
                label="Stay Type"
                name="stay_type"
                value={formData.stay_type ?? 'pickup'}  // Устанавливаем значение 'pickup' по умолчанию
                onChange={handleChange}
                fullWidth
                margin="normal"
            >
                <MenuItem value="pickup">Pickup by Catnanny</MenuItem>
                <MenuItem value="visit">Visit at Owner’s</MenuItem>
            </TextField>
            <TextField
                label="Message"
                name="message"
                value={formData.message ?? ''}  // Устанавливаем пустую строку, если значение undefined
                onChange={handleChange}
                multiline
                rows={4}
                fullWidth
                margin="normal"
            />

            {!orderId && (
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ marginTop: 2 }}
                >
                    Submit Request
                </Button>
            )}

            {status === 'succeeded' &&
                <Typography color="success.main">Request {orderId ? 'updated' : 'created'} successfully.</Typography>}
            {status === 'loading' && <Typography color="primary.main">Submitting request...</Typography>}
            {status === 'failed' && <Typography color="error.main">Error: {error}</Typography>}
        </Box>
    );
};

export default OrderForm;
