import React, {useEffect, useState, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../redux/store';
import {fetchProfile, updateProfile} from '../redux/profileSlice';
import {Box, TextField, Button, Checkbox, FormControlLabel, Typography} from '@mui/material';
import Cropper from 'react-easy-crop';
import {getCroppedImg} from "../redux/cropImage";
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {theme} from "./HomeCat";
import {useParams} from "react-router-dom";

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
    photo: string | File;  // Changed to string | File
    is_catnanny: boolean;
    is_pet_owner: boolean;
}

const ProfileForm: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Получаем id из URL, если он есть
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
        is_pet_owner: profile?.is_pet_owner || false
    });

    useEffect(() => {
        const fetchData = async () => {
            if (id) {
                await dispatch(fetchProfile({ id })); // Если есть id, загружаем профиль няни
            } else {
                await dispatch(fetchProfile({})); // Если id нет, загружаем профиль текущего пользователя
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
                is_catnanny: profile?.is_catnanny || false,
                is_pet_owner: profile?.is_pet_owner || false
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

    const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = new FormData();

        // If there is a new image and cropped area, add cropped image to FormData
        if (image && croppedAreaPixels) {
            const croppedImg = await getCroppedImg(image as string, croppedAreaPixels);

            const blob = await fetch(croppedImg)
                .then(res => {
                    if (!res.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return res.blob();
                });

            const file = new File([blob], 'croppedImage.jpg', {type: 'image/jpeg'});
            data.append('photo', file);
        }

        // Add other profile data, excluding the photo field if it hasn’t changed
        Object.entries(formData).forEach(([key, value]) => {
            if (key !== 'photo' || (value && typeof value !== 'string')) {  // Check that photo is not an empty string
                data.append(key, value instanceof File ? value : String(value));
            }
        });

        dispatch(updateProfile(data));
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
                    label="Phone Number"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    margin="normal"
                    variant="outlined"
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
                />

                <TextField
                    fullWidth
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    margin="normal"
                    variant="outlined"
                />

                <TextField
                    fullWidth
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    margin="normal"
                    variant="outlined"
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
                /><br/>

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={formData.visit}
                            onChange={handleChange}
                            name="pickup"
                        />
                    }
                    label="Works at Client Site"
                    sx={{marginBottom: 1}}
                />

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

                {image && (
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

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{marginTop: 2}}
                >
                    Update Profile
                </Button>

                {status === 'succeeded' && <Typography color="success.main">Profile updated successfully.</Typography>}
                {status === 'loading' && <Typography color="primary.main">Updating profile...</Typography>}
                {status === 'failed' && <Typography
                    color="error.main"> {typeof error === 'string' ? error : JSON.stringify(error)}</Typography>}
            </Box>
        </ThemeProvider>
    );
};

export default ProfileForm;
