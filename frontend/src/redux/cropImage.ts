import { createCanvas, loadImage } from 'canvas';

// Генерация уникального имени файла
const generateUniqueFilename = () => `cropped-image-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.jpg`;

export const getCroppedImg = async (imageSrc: string, pixelCrop: any): Promise<{ base64Image: string; uniqueFilename: string }> => {
    return new Promise((resolve, reject) => {
        loadImage(imageSrc)
            .then((image) => {
                const canvas = createCanvas(pixelCrop.width, pixelCrop.height);
                const ctx = canvas.getContext('2d');

                // Crop the image based on provided coordinates
                ctx.drawImage(
                    image,
                    pixelCrop.x,
                    pixelCrop.y,
                    pixelCrop.width,
                    pixelCrop.height,
                    0,
                    0,
                    pixelCrop.width,
                    pixelCrop.height
                );

                // Get the cropped image as a data URL
                const base64Image = canvas.toDataURL('image/jpeg');
                const uniqueFilename = generateUniqueFilename(); // Получаем уникальное имя

                resolve({ base64Image, uniqueFilename });
            })
            .catch((error) => {
                reject(error);
            });
    });
};
