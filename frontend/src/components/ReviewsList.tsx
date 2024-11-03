import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserReviews } from "../redux/reviewsSlice";
import { AppDispatch, RootState } from '../redux/store';
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
import {useNavigate} from "react-router-dom";

const ReviewsList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { reviews, status, error } = useSelector((state: RootState) => state.reviews);
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchUserReviews());
    }, [dispatch]);

    if (status === 'loading') {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (status === 'failed') {
        return <Typography color="error">Error: {error}</Typography>;
    }

    const handleRowClick = (reviewId: number) => {
        navigate(`/review/${reviewId}`);
    };

    return (
        <TableContainer component={Paper} sx={{ maxWidth: 800, margin: 'auto', mt: 5 }}>
            <Typography variant="h4" component="div" gutterBottom align="center">
                Reviews List
            </Typography>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell align="center"><strong>Reviewer</strong></TableCell>
                        <TableCell align="center"><strong>Catnanny</strong></TableCell>
                        <TableCell align="center"><strong>Review</strong></TableCell>
                        <TableCell align="center"><strong>Rating</strong></TableCell>
                        <TableCell align="center"><strong>Date</strong></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {reviews.map((review) => (
                        <TableRow
                            key={review.id}
                            hover // исправлено
                            onClick={() => handleRowClick(review.id)}
                            sx={{ cursor: 'pointer' }}
                        >
                            <TableCell align="center">
                                {review.owner.first_name} {review.owner.last_name}
                            </TableCell>
                            <TableCell align="center">
                                {review.catnanny.first_name} {review.catnanny.last_name}
                            </TableCell>
                            <TableCell align="center">{review.review}</TableCell>
                            <TableCell align="center">{review.rating}</TableCell>
                            <TableCell align="center">{new Date(review.created_at).toLocaleDateString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>

            </Table>
        </TableContainer>
    );
};

export default ReviewsList;
