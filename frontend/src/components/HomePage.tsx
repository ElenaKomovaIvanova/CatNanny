import React, {useEffect, useRef} from 'react';
import {Box, Grid, Typography, Card, CardContent, CardMedia, ThemeProvider, createTheme} from '@mui/material';

const theme = createTheme({
    spacing: 8,
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    display: 'flex',
                    maxWidth: '100%',
                    margin: '0 auto',
                    position: 'sticky', // Карточка остаётся в верхней части экрана
                    top: 0,
                    transition: 'transform 0.8s ease, z-index 0.05s ease',
                },
            },
        },
    },
});

const HomePage: React.FC = () => {
    const cardRefs = useRef<HTMLDivElement[]>([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry, index) => {
                    const target = entry.target as HTMLElement;
                    if (entry.isIntersecting) {
                        // Когда карточка входит в видимую область, увеличиваем её zIndex и возвращаем в исходное положение
                        target.style.zIndex = `${100 - index}`;
                        target.style.transform = 'translateY(0)';
                    } else {
                        // Когда карточка выходит из видимой области, уменьшите её zIndex и сдвиг
                        target.style.zIndex = `${index}`;
                        target.style.transform = 'translateY(40px)';
                    }
                });
            },
            {threshold: 0.1} // Карточка активируется при пересечении 50% видимой области
        );

        cardRefs.current.forEach((card) => card && observer.observe(card));

        return () => observer.disconnect();
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{padding: theme.spacing(2.5), overflowY: 'auto', height: '90vh'}}>
                {/*<Typography variant="h4" gutterBottom>*/}
                {/*    When you need help caring for your pet,*/}
                {/*</Typography>*/}
                {/*<Typography variant="h4" gutterBottom>*/}
                {/*    our experienced pet sitters are always here to help.*/}
                {/*</Typography>*/}

                <Card ref={(el) => el && (cardRefs.current[0] = el)} sx={{transform: 'translateY(40px)', zIndex: 3}}>
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <CardContent>
                                <Typography variant="h5" gutterBottom>
                                    When you need help caring for your pet,
                                </Typography>
                                <Typography variant="h5" gutterBottom>
                                    our experienced pet sitters are always here to help.
                                </Typography>
                                <Typography>
                                    Pet hotels and foster care facilities are only convenient for us humans. While they
                                    may provide basic necessities, these environments are often stressful for pets,
                                    especially those used to the comforts of their own home. Dogs and cats feel most at
                                    ease in familiar surroundings, where their favorite toys, smells, and routines
                                    remain unchanged.
                                </Typography>
                            </CardContent>
                        </Grid>
                        <Grid item xs={12} md={6} sx={{display: 'flex'}}>
                            <CardMedia
                                component="img"
                                image="/1.png"
                                alt="Cat Image 1"
                                sx={{width: '100%', height: '100%', objectFit: 'cover'}}
                            />
                        </Grid>
                    </Grid>
                </Card>

                <Card ref={(el) => el && (cardRefs.current[1] = el)}
                      sx={{transform: 'translateY(40px)', zIndex: 2, marginTop: '-50px'}}>
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={6} sx={{display: 'flex'}}>
                            <CardMedia
                                component="img"
                                image="/2.png"
                                alt="Cat Image 2"
                                sx={{width: '100%', height: '100%', objectFit: 'cover'}}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <CardContent>
                                <Typography>
                                    The nanny will feed the cat, change the tray and water, send a photo and video
                                    report, and play with the cat if desired. This personalized care allows the pet to
                                    feel comfortable and safe, maintaining a routine even in your absence. The nanny's
                                    updates provide peace of mind, showing that your pet is not just cared for but given
                                    the attention and affection it deserves. Whether it's an extra treat, a bit of
                                    playtime, or simply companionship, the nanny ensures that your pet stays happy and
                                    relaxed.
                                </Typography>
                            </CardContent>
                        </Grid>
                    </Grid>
                </Card>

                <Card ref={(el) => el && (cardRefs.current[2] = el)}
                      sx={{transform: 'translateY(40px)', zIndex: 1, marginTop: '-50px'}}>
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <CardContent>
                                <Typography>
                                    Beyond basic care, the nanny is trained to observe and respond to any signs of
                                    discomfort or illness, offering an extra layer of security. If your pet needs
                                    medication or has special dietary requirements, you can trust that these needs will
                                    be met precisely. Our goal is not only to take care of your pet’s physical needs but
                                    also to provide emotional support, so your pet feels loved and attended to even when
                                    you're not around.
                                </Typography>
                            </CardContent>
                        </Grid>
                        <Grid item xs={12} md={6} sx={{display: 'flex'}}>
                            <CardMedia
                                component="img"
                                image="/3.png"
                                alt="Cat Image 3"
                                sx={{width: '100%', height: '100%', objectFit: 'cover'}}
                            />
                        </Grid>
                    </Grid>
                </Card>
            </Box>
        </ThemeProvider>
    );
};

export default HomePage;
