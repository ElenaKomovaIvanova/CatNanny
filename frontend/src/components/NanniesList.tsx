import React, { useState, useEffect } from 'react';
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
import { fetchNannies } from "../redux/nannySlice";
import {fetchProfile} from "../redux/profileSlice";

// Определение интерфейса Nanny
interface Nanny {
    id: number;
    bio: string;
    city: string;
    photo: string;
}

const NanniesList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { nannies, status, error } = useSelector((state: RootState) => state.nannies);

    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchNannies({ startDate, endDate }));
        }
    }, [status, dispatch, startDate, endDate]);

    const handleFilterSubmit = () => {
        dispatch(fetchNannies({ startDate, endDate }));
    };

    const handleCardClick = (nannyId: number) => {
        navigate(`profile/${nannyId}`, {
            state: { startDate, endDate },
        });
    };

    if (status === 'loading') return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;
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
                                <Typography variant="body2" color="text.secondary">
                                    {nanny.bio}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {nanny.city}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default NanniesList;
