import React, {useEffect, useState, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../redux/store';
import {fetchProfile, updateProfile} from '../redux/profileSlice';
import {Box, TextField, Button, Checkbox, FormControlLabel, Typography, CircularProgress} from '@mui/material';
import Cropper from 'react-easy-crop';
import {getCroppedImg} from "../redux/cropImage";
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {theme} from "./HomeCat";
import {useLocation, useNavigate, useParams} from "react-router-dom";

// Interface for profile data
interface ProfileFormData {
    phone_number: string;
    bio: string;
    city: string;
    address: string;
    has_pets: boolean;
    has_children_under_10: boolean;
    pickup: boolean;
    visit: boolean;
    photo: string | File;
    is_catnanny: boolean;
    is_pet_owner: boolean;
    user_id: string;
    first_name: string; // добавляем имя
    last_name: string;  // добавляем фамилию
}

interface LocationState {
    startDate?: string;
    endDate?: string;
    first_name: string;
    last_name: string;
}

const ProfileForm: React.FC = () => {
    const {id} = useParams<{ id: string }>(); // Get the id from the URL, if it exists
    const userId = localStorage.getItem('profile_id');
    const isOwner = !id || id === userId;
    const dispatch = useDispatch<AppDispatch>();
    const {profile, status, error} = useSelector((state: RootState) => state.profile);

    const [formData, setFormData] = useState<ProfileFormData>({
        phone_number: profile?.phone_number || '',
        bio: profile?.bio || '',
        city: profile?.city || '',
        address: profile?.address || '',
        has_pets: profile?.has_pets || false,
        has_children_under_10: profile?.has_children_under_10 || false,
        pickup: profile?.pickup || false,
        visit: profile?.visit || false,
        photo: profile?.photo || '',
        is_catnanny: profile?.is_catnanny || false,
        is_pet_owner: profile?.is_pet_owner || false,
        user_id: profile?.user_id || '',
        first_name: profile?.first_name || '', // добавляем имя
        last_name: profile?.last_name || ''
    });

    useEffect(() => {
        const fetchData = async () => {
            if (id) {
                await dispatch(fetchProfile({id})); // If there is an id, load the nanny's profile
            } else {
                await dispatch(fetchProfile({})); // If there is no id, load the current user's profile
            }
        };
        fetchData();
    }, [dispatch, id]);

    // Update formData when profile data is successfully fetched
    useEffect(() => {
        if (profile) {
            setFormData({
                phone_number: profile.phone_number || '',
                bio: profile.bio || '',
                city: profile.city || '',
                address: profile.address || '',
                has_pets: profile.has_pets || false,
                has_children_under_10: profile.has_children_under_10 || false,
                pickup: profile.pickup || false,
                visit: profile.visit || false,
                photo: profile.photo || '',
                is_catnanny: profile.is_catnanny || false,
                is_pet_owner: profile.is_pet_owner || false,
                user_id: profile.user_id || '',
                first_name: profile.first_name || '', // добавляем имя
                last_name: profile.last_name || '',   // добавляем фамилию
            });
        }
    }, [profile]);

    const [image, setImage] = useState<string | ArrayBuffer | null>(null);
    const [crop, setCrop] = useState({x: 0, y: 0});
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value, type} = e.target;

        if (type === 'checkbox') {
            const target = e.target as HTMLInputElement;
            setFormData({
                ...formData,
                [name]: target.checked,
            });
        } else if (type === 'file') {
            const target = e.target as HTMLInputElement;
            const file = target.files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImage(reader.result);
                };
                reader.readAsDataURL(file);
            }
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const location = useLocation() as unknown as Location & { state?: LocationState };
    const navigate = useNavigate();

    // Извлекаем startDate и endDate из location.state, если они переданы
    const {startDate = '', endDate = '', first_name, last_name} = location.state || {};
    const handleCreateOrder = () => {
        navigate(`/orders/new`, {
            state: {
                startDate,
                endDate,
                first_name: formData.first_name,
                last_name: formData.last_name,
                catnanny: location.pathname.split('/').pop(), // ID профиля
            },
        });
    };

    const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = new FormData();

        if (image && croppedAreaPixels) {
            const {base64Image, uniqueFilename} = await getCroppedImg(image as string, croppedAreaPixels);

            // Создаем blob и файл
            const blob = await fetch(base64Image).then((res) => res.blob());
            const file = new File([blob], uniqueFilename, {type: 'image/jpeg'});

            data.append('photo', file); // Добавляем уникальный файл
        }

        Object.entries(formData).forEach(([key, value]) => {
            if (key !== 'photo' || (value && typeof value !== 'string')) {
                data.append(key, value instanceof File ? value : String(value));
            }
        });

        dispatch(updateProfile(data)); // отправка данных профиля и файла
    };

    return (
        <ThemeProvider theme={theme}>
            <Box component="form" onSubmit={handleSubmit} sx={{maxWidth: 400, margin: 'auto', padding: 2}}>
                <Typography variant="h4" gutterBottom>
                    Profile Settings
                </Typography>

                {profile?.photo && typeof profile.photo === 'string' && (
                    <img
                        src={profile.photo}
                        alt="Profile"
                        style={{width: '150px', height: '150px', borderRadius: '50%', marginBottom: '16px'}}
                    />
                )}

                <TextField
                    fullWidth
                    label="First Name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    margin="normal"
                    variant="outlined"
                    disabled={!isOwner}
                />

                <TextField
                    fullWidth
                    label="Last Name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    margin="normal"
                    variant="outlined"
                    disabled={!isOwner}
                />

                <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    margin="normal"
                    variant="outlined"
                    disabled={!isOwner}
                />

                <TextField
                    fullWidth
                    label="Bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    margin="normal"
                    multiline
                    rows={4}
                    variant="outlined"
                    disabled={!isOwner}
                />

                <TextField
                    fullWidth
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    margin="normal"
                    variant="outlined"
                    disabled={!isOwner}
                />

                <TextField
                    fullWidth
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    margin="normal"
                    variant="outlined"
                    disabled={!isOwner}
                /><br/>

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={formData.is_catnanny}
                            onChange={handleChange}
                            name="is_catnanny"
                        />
                    }
                    label="Cat Nanny"
                    sx={{marginBottom: 1}}
                    disabled={!isOwner}
                /><br/>

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={formData.is_pet_owner}
                            onChange={handleChange}
                            name="is_pet_owner"
                        />
                    }
                    label="Pet Owner"
                    sx={{marginBottom: 1}}
                    disabled={!isOwner}
                /><br/>

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={formData.has_pets}
                            onChange={handleChange}
                            name="has_pets"
                        />
                    }
                    label="Has Pets"
                    sx={{marginBottom: 1}}
                    disabled={!isOwner}
                /><br/>

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={formData.has_children_under_10}
                            onChange={handleChange}
                            name="has_children_under_10"
                        />
                    }
                    label="Has Children Under 10"
                    sx={{marginBottom: 1}}
                    disabled={!isOwner}
                /><br/>

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={formData.pickup}
                            onChange={handleChange}
                            name="pickup"
                        />
                    }
                    label="Takes home"
                    sx={{marginBottom: 1}}
                    disabled={!isOwner}
                /><br/>

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={formData.visit}
                            onChange={handleChange}
                            name="visit"
                        />
                    }
                    label="Works at Client Site"
                    sx={{marginBottom: 1}}
                    disabled={!isOwner}
                />
                {isOwner && (
                    <label htmlFor="photo-upload">
                        <input
                            accept="image/*"
                            id="photo-upload"
                            type="file"
                            name="photo"
                            onChange={handleChange}
                            style={{display: 'none'}} // Hide standard input
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            component="span"
                            startIcon={<PhotoCamera/>} // Add icon
                            fullWidth
                            sx={{margin: '1rem 0'}}
                        >
                            Upload Photo
                        </Button>
                    </label>
                )}
                {(image && isOwner) && (
                    <div style={{position: 'relative', height: '400px', width: '400px'}}>
                        <Cropper
                            image={image as string}
                            crop={crop}
                            zoom={zoom}
                            aspect={4 / 3} // Set aspect ratio as desired
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={onCropComplete}
                        />
                    </div>
                )}

                {isOwner && (
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{marginTop: 2}}
                    >
                        Update Profile
                    </Button>
                )}
                {id && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCreateOrder}
                        fullWidth
                        sx={{marginTop: 2}}
                    >
                        Create order
                    </Button>
                )}

                {status === 'succeeded' && <Typography color="success.main">Profile updated successfully.</Typography>}
                {status === 'loading' &&
                    <Box sx={{display: 'flex', justifyContent: 'center', mt: 5}}><CircularProgress/></Box>}
                {status === 'failed' && <Typography
                    color="error.main"> {typeof error === 'string' ? error : JSON.stringify(error)}</Typography>}
            </Box>
        </ThemeProvider>
    );
};

export default ProfileForm;
