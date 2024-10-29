import {createCanvas, loadImage} from 'canvas';

export const getCroppedImg = async (imageSrc: string, pixelCrop: any): Promise<string> => {
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
                resolve(base64Image);
            })
            .catch((error) => {
                reject(error);
            });
    });
};
