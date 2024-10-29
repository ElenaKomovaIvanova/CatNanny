import React from 'react';
import {Box, Grid, Typography, Card, CardContent, CardMedia, ThemeProvider, createTheme} from '@mui/material';

const theme = createTheme({
    spacing: 8, // Custom spacing value
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    display: 'flex',
                    marginBottom: '20px',
                    maxWidth: '100%',
                    margin: '0 auto',
                },
            },
        },
        MuiCardMedia: {
            styleOverrides: {
                img: {
                    width: '80%',
                    maxHeight: '40%',
                    objectFit: 'contain',
                },
            },
        },
        MuiTypography: {
            styleOverrides: {
                h4: {
                    marginBottom: '20px',
                },
            },
        },
    },
});

const HomePage: React.FC = () => {
    return (
        <ThemeProvider theme={theme}>
            <Box sx={{padding: theme.spacing(2.5)}}>
                <Typography variant="h4" gutterBottom>
                    When you need help caring for your pet, our experienced pet sitters are always here to help.
                </Typography>

                {/* Card with image on the left and text on the right */}
                <Card>
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <CardContent>
                                <Typography>
                                    Pet hotels and foster care facilities are only convenient for us humans. Dogs and
                                    cats are always more comfortable at home.
                                    The pet remains at home, does not experience the stress of moving to a pet hotel
                                    and, on the contrary, is not in contact with other animals.
                                </Typography>
                            </CardContent>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <CardMedia
                                component="img"
                                image="/1.png"
                                alt="Cat Image 1"
                            />
                        </Grid>
                    </Grid>
                </Card>

                {/* Card with image on the right and text on the left */}
                <Card>
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <CardMedia
                                component="img"
                                image="/2.png"
                                alt="Cat Image 2"
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <CardContent>
                                <Typography>
                                    The nanny will feed the cat, change the tray and water, send a photo and video
                                    report, and play with the cat if desired.
                                </Typography>
                            </CardContent>
                        </Grid>
                    </Grid>
                </Card>

                {/* Card with image on the left and text on the right */}
                <Card>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <CardContent>
                                <Typography>
                                    This is another example of alternating content with an image. Use this structure to
                                    highlight key points about your service or product.
                                </Typography>
                            </CardContent>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <CardMedia
                                component="img"
                                image="/3.png"
                                alt="Cat Image 3"
                            />
                        </Grid>
                    </Grid>
                </Card>
            </Box>
        </ThemeProvider>
    );
};

export default HomePage;
