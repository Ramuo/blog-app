import dotenv from 'dotenv';
dotenv.config();
import {v2 as cloudinary} from 'cloudinary';


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

const cloudinaryUploadImg = async fileToUpload => {
    try {
        const data = await cloudinary.uploader.upload(fileToUpload, {
            resource_type: "auto",
        });
        return {
            url: data.secure_url,
        };
    } catch (error) {
        return error
    }
};

export default cloudinaryUploadImg;