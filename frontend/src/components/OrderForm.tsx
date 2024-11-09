import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../redux/store';
import {createOrder, fetchOrder, OrderData, updateRequest} from '../redux/orderSlice';
import {
    TextField,
    Button,
    MenuItem,
    Typography,
    Box,
    FormControl,
    InputLabel,
    Select,
    SelectChangeEvent,
    Grid
} from '@mui/material';
import {useParams, useNavigate, useLocation} from 'react-router-dom';
import {updateOrderStatus} from "../redux/statusSlice";
import {setCatnannyData} from "../redux/reviewSlice";
import VisitForm from "./VisitForm";
import VisitsList from "./VisitsList";
import Chat from "./Chat";

const OrderForm: React.FC = () => {
    const currentUserProfileId: number = Number(localStorage.getItem('profile_id'));
    const location = useLocation();
    const {orderId} = useParams<{ orderId?: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const {status, error} = useSelector((state: RootState) => state.request);
    const {startDate, endDate, first_name, last_name, catnanny} = location.state || {
        startDate: '',
        endDate: '',
        catnanny: ''
    };
    const [initialStatus, setInitialStatus] = useState<string | null>(null);

    const [formData, setFormData] = useState<OrderData>({
        catnanny_first_name: first_name,
        catnanny_last_name: last_name,
        catnanny: catnanny,
        cat_name: '',
        cat_gender: 'M',
        cat_weight: 0,
        cat_age: 0,
        start_date: startDate,
        end_date: endDate,
        stay_type: 'pickup',
        message: '',
        current_status: '',
        allowed_statuses: []
    });

    useEffect(() => {
        if (orderId) {
            dispatch(fetchOrder(orderId)).then((response: any) => {
                if (response.payload) {
                    setFormData(response.payload);
                    setInitialStatus(response.payload.current_status);
                }
            });
        }
    }, [orderId, dispatch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleStatusChange = (event: SelectChangeEvent<string>) => {
        setFormData({
            ...formData,
            current_status: event.target.value as string,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (orderId) {
                await dispatch(updateRequest({id: orderId, ...formData})).unwrap();
                navigate('/orders');
            } else {
                await dispatch(createOrder(formData)).unwrap();
                navigate('/orders');
            }
        } catch (error) {
            // Error handling
        }
    };

    const handleUpdateStatusClick = () => {
        if (orderId && formData.current_status) {
            const numericOrderId = parseInt(orderId, 10);
            dispatch(updateOrderStatus({order_id: numericOrderId, status_order: formData.current_status}));
        }
    };

    const handleWriteReview = () => {
        const catnannyData = {
            id: Number(formData.catnanny),
            first_name: formData.catnanny_first_name,
            last_name: formData.catnanny_last_name
        };
        dispatch(setCatnannyData(catnannyData));
        navigate('/review/new');
    };

    const renderButtonLabel = () => {
        if (!orderId) {
            return 'Create Order';
        } else if (initialStatus === 'new') {
            return 'Edit Order';
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{maxWidth: 800, margin: 'auto', padding: 2}}>
            <Typography variant="h4" gutterBottom>
                {orderId ? `Order N${orderId}` : 'New Order'}
            </Typography>

            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Status</InputLabel>
                        <Select
                            name="status"
                            value={formData.current_status || ''}
                            onChange={handleStatusChange}
                        >
                            {formData.allowed_statuses?.map((statusOption: string) => (
                                <MenuItem key={statusOption} value={statusOption}>{statusOption}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                    <TextField
                        label="Catnanny"
                        name="catnanny"
                        value={`${formData.catnanny_first_name} ${formData.catnanny_last_name}`.trim()}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <TextField
                        label="Cat Name"
                        name="cat_name"
                        value={formData.cat_name ?? ''}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <TextField
                        select
                        label="Cat Gender"
                        name="cat_gender"
                        value={formData.cat_gender ?? 'M'}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    >
                        <MenuItem value="M">Male</MenuItem>
                        <MenuItem value="F">Female</MenuItem>
                    </TextField>
                </Grid>

                <Grid item xs={12} md={6}>
                    <TextField
                        label="Cat Weight (kg)"
                        name="cat_weight"
                        type="number"
                        value={formData.cat_weight ?? 0}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <TextField
                        label="Cat Age (years)"
                        name="cat_age"
                        type="number"
                        value={formData.cat_age ?? 0}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <TextField
                        label="Start Date"
                        name="start_date"
                        type="date"
                        value={formData.start_date ?? ''}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{shrink: true}}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <TextField
                        label="End Date"
                        name="end_date"
                        type="date"
                        value={formData.end_date ?? ''}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{shrink: true}}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <TextField
                        select
                        label="Stay Type"
                        name="stay_type"
                        value={formData.stay_type ?? 'pickup'}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    >
                        <MenuItem value="pickup">Pickup by Catnanny</MenuItem>
                        <MenuItem value="visit">Visit at Owner’s</MenuItem>
                    </TextField>
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        label="Message"
                        name="message"
                        value={formData.message ?? ''}
                        onChange={handleChange}
                        multiline
                        rows={4}
                        fullWidth
                        margin="normal"
                    />
                </Grid>
            </Grid>

            <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{marginTop: 2}}
            >
                {renderButtonLabel()}
            </Button>

            <Button
                type="button"
                variant="contained"
                color="primary"
                fullWidth
                sx={{marginTop: 2}}
                onClick={handleUpdateStatusClick}
            >
                Update status
            </Button>

            <Button
                type="button"
                variant="contained"
                color="primary"
                fullWidth
                sx={{marginTop: 2}}
                onClick={handleWriteReview}
            >
                Write a review
            </Button>

            {/* Add the VisitForm here */}
            {orderId && (
                <VisitForm
                    catnannyId={Number(formData.catnanny)} // Преобразуйте в число
                    orderId={orderId ? Number(orderId) : 0}
                    startDate={formData.start_date}
                    endDate={formData.end_date}
                    currentUserProfileId={currentUserProfileId}
                />
            )}

            {orderId && (
                <VisitsList
                    orderId={orderId ? Number(orderId) : 0}
                />
            )}

            {orderId && (
                <Chat orderId={Number(orderId)} currentUserProfileId={currentUserProfileId}/>
            )}

            {status === 'succeeded' && (
                <Typography color="success.main">Request {orderId ? 'updated' : 'created'} successfully.</Typography>
            )}

            {status === 'loading' && <Typography color="primary.main">Submitting request...</Typography>}
            {status === 'failed' && error && (
                typeof error === 'object' ? (
                    Object.entries(error).map(([field, message]: [string, any]) => (
                        <Typography key={field} color="error.main">
                            {`${field}: ${Array.isArray(message) ? message.join(', ') : message}`}
                        </Typography>
                    ))
                ) : (
                    <Typography color="error.main">
                        {typeof error === 'string' ? error : JSON.stringify(error)}
                    </Typography>
                )
            )}
        </Box>
    );
};

export default OrderForm;
