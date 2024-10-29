// src/components/OrdersList.tsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders } from "../redux/ordersSlice";
import { AppDispatch, RootState } from "../redux/store";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    CircularProgress,
    Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const OrdersList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { orders, status, error } = useSelector((state: RootState) => state.orders);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchOrders());
        }
    }, [status, dispatch]);

    if (status === 'loading') return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;
    if (status === 'failed') return <p>Error: {error}</p>;

    const handleRowClick = (orderId: number) => {
        navigate(`/orders/${orderId}`);
    };

    return (
        <TableContainer component={Paper} sx={{ maxWidth: 800, margin: 'auto', mt: 5 }}>
            <Typography variant="h4" component="div" gutterBottom align="center">
                Order List
            </Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell align="center"><strong>Order Number</strong></TableCell>
                        <TableCell align="center"><strong>Period</strong></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {orders.map((order) => (
                        <TableRow
                            key={order.id}
                            hover
                            onClick={() => handleRowClick(order.id)}
                            sx={{ cursor: 'pointer' }} // Указатель при наведении на строку
                        >
                            <TableCell align="center">{order.id}</TableCell>
                            <TableCell align="center">{order.start_date} - {order.end_date}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default OrdersList;
