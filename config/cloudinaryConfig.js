import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

export const fileUploadOnCloud = async (path) => {
    
    try {
        // const response = await cloudinary.uploader.upload(path, { folder: 'VISION' });
        // console.log(response);
        // url = response.secure_url;
        // return 'https://res.cloudinary.com/diznagcfg/image/upload/v1762544803/vision_brush/ruvvkl46l2fipbsr3qvy.jpg';
        return '../src/assets/forgotPasswordB1.jpg';
        // return url;
    } catch (error) {
        console.log('Cloudinary error : ', error);
        return false;
    }
}
