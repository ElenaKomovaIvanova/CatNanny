import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from "../redux/store";
import {
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Box,
    Grid,
    CardMedia,
    TextField,
    Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {fetchNannies, resetNannies} from "../redux/nannySlice";

// Определение интерфейса Nanny
interface Nanny {
    id: number;
    bio: string;
    city: string;
    photo: string;
    first_name: string;
    last_name: string;
    average_rating: number;
}

const NanniesList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { nannies, status, error, nextOffset } = useSelector((state: RootState) => state.nannies);

    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [loadingMore, setLoadingMore] = useState(false);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchNannies({ startDate, endDate, offset: 0 }));
        }
    }, [status, dispatch, startDate, endDate]);


    const handleFilterSubmit = () => {
        dispatch(resetNannies());
        dispatch(fetchNannies({ startDate, endDate, offset: 0 }));
    };

    const handleCardClick = (nannyId: number) => {
        navigate(`profile/${nannyId}`, {
            state: { startDate, endDate },
        });
    };

    // Обработчик прокрутки для бесконечного скролла
    const handleScroll = useCallback(() => {
        if (loadingMore || !nextOffset) return;

        if (
            window.innerHeight + document.documentElement.scrollTop >=
            document.documentElement.offsetHeight - 100
        ) {
            setLoadingMore(true);
            dispatch(fetchNannies({ startDate, endDate, offset: nextOffset })).finally(() => {
                setLoadingMore(false);
            });
        }
    }, [dispatch, startDate, endDate, nextOffset, loadingMore]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    if (status === 'loading' && nannies.length === 0) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;
    }
    if (status === 'failed') return <p>Error: {error}</p>;

    return (
        <Box sx={{ maxWidth: 800, margin: 'auto', mt: 5 }}>
            <Typography variant="h4" component="div" gutterBottom align="center">
                Nannies
            </Typography>

            {/* Фильтры по дате */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
                <TextField
                    label="Start Date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    label="End Date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                />
                <Button variant="contained" onClick={handleFilterSubmit}>
                    Apply Filter
                </Button>
            </Box>

            {/* Список нянь */}
            <Grid container spacing={3}>
                {nannies.map((nanny: Nanny) => (
                    <Grid item xs={12} sm={6} md={4} key={nanny.id}>
                        <Card
                            onClick={() => handleCardClick(nanny.id)}
                            sx={{
                                cursor: 'pointer',
                                height: '100%',
                                '&:hover': {
                                    boxShadow: 6, // Добавляем тень при наведении
                                },
                                transition: '0.3s' // Плавный переход эффекта
                            }}
                        >
                            <CardMedia
                                component="img"
                                height="140"
                                image={nanny.photo}
                                alt="Nanny's photo"
                            />
                            <CardContent>
                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold' }}>
                                    {nanny.first_name} {nanny.last_name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {nanny.bio}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    City: {nanny.city}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Average Rating: {nanny.average_rating.toFixed(1)}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {loadingMore && <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}><CircularProgress /></Box>}
        </Box>
    );
};

export default NanniesList;
