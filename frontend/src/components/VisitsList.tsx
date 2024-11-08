import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {fetchVisits} from '../redux/visitsSlice'; // Импортируем экшен для загрузки визитов
import {AppDispatch, RootState} from '../redux/store';
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
import {useParams, useNavigate} from 'react-router-dom';

interface VisitListProps {
    orderId: number; // ID заказа, для которого отображаются визиты
}

const VisitList: React.FC<VisitListProps> = ({orderId}) => {
    const dispatch = useDispatch<AppDispatch>();

    const {visits, status, error} = useSelector((state: RootState) => state.visits);

    useEffect(() => {
        if (orderId) {
            dispatch(fetchVisits(orderId));  // передаем orderId в fetchVisits
        }
    }, [dispatch, orderId]);

    if (status === 'loading') return <Box
        sx={{display: 'flex', justifyContent: 'center', mt: 5}}><CircularProgress/></Box>;
    if (status === 'failed') return <Typography color="error">{error}</Typography>;

    // Фильтруем визиты по ID заказа
    // const filteredVisits = visits.filter(visit => visit.order === orderId);

    if (status === 'succeeded' && visits.length === 0) {
        return <Typography sx={{mt: 5, textAlign: 'center'}}>No visits available for this order.</Typography>;
    }

    return (
        <TableContainer component={Paper} sx={{maxWidth: 800, margin: 'auto', mt: 5}}>
            {/*<Typography variant="h4" component="div" gutterBottom align="center">*/}
            {/*    Visit List for Order {orderId}*/}
            {/*</Typography>*/}
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell align="center"><strong>Visit Date</strong></TableCell>
                        <TableCell align="center"><strong>Catnanny ID</strong></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {visits.length > 0 ? (
                        visits.map((visit) => (
                            <TableRow key={visit.id}>
                                <TableCell align="center">{new Date(visit.date).toLocaleDateString()}</TableCell>
                                <TableCell align="center">{visit.catnanny}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell align="center" colSpan={2}>
                                No visits available for this order.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default VisitList;
