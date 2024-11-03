import {useNavigate, useParams} from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, TextField, Box, Typography } from '@mui/material';
import {fetchReviewById, saveReview} from "../redux/reviewSlice"; // Импортируйте нужные действия
import { AppDispatch, RootState } from "../redux/store";

const ReviewForm: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { id } = useParams<{ id?: string }>(); // Получаем ID из URL
    const catnannyData = useSelector((state: RootState) => state.review.catnannyData);
    const currentReview = useSelector((state: RootState) => state.review.currentReview);
    const navigate = useNavigate();

    const [review, setReview] = useState(currentReview ? currentReview.review : '');
    const [rating, setRating] = useState(currentReview ? currentReview.rating : 1);

    useEffect(() => {
        if (id) {
            dispatch(fetchReviewById(Number(id))); // Загружаем отзыв, если ID существует
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (currentReview) {
            setReview(currentReview.review);
            setRating(currentReview.rating);
        }
    }, [currentReview]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (catnannyData) {
            const reviewData = {
                catnanny: catnannyData.id,
                review,
                rating,
            };

            if (id) {
                await dispatch(saveReview({ id: Number(id), ...reviewData })); // Обновление существующего отзыва
            } else {
                await dispatch(saveReview(reviewData)); // Создание нового отзыва
            }
            setReview('');
            setRating(1);
            navigate('/review/list');
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400, margin: 'auto', padding: 2 }}>
            <Typography variant="h6" gutterBottom>
                {id ? 'Edit Review' : 'Add a Review'} for {catnannyData ? `${catnannyData.first_name} ${catnannyData.last_name}` : 'Catnanny'}
            </Typography>
            <TextField
                label="Catnanny"
                value={catnannyData ? `${catnannyData.first_name} ${catnannyData.last_name}` : ''}
                fullWidth
                margin="normal"
                InputProps={{
                    readOnly: true,
                }}
            />
            <TextField
                label="Review"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                multiline
                rows={4}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Rating (1-10)"
                type="number"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                fullWidth
                margin="normal"
                inputProps={{ min: 1, max: 10 }}
            />
            <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ marginTop: 2 }}
            >
                Submit Review
            </Button>
        </Box>
    );
};

export default ReviewForm;
