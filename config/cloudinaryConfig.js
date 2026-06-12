import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

export const fileUploadOnCloud = async (path) => {

    try {
        // const response = await cloudinary.uploader.upload(path, { folder: 'VISION', resource_type: "auto" });
        // console.log(response);
        // return 'https://res.cloudinary.com/diznagcfg/image/upload/v1762544803/vision_brush/ruvvkl46l2fipbsr3qvy.jpg';
        return 'C:/Users/HP/Pictures/469360741_452483784584981_8172663604888938380_n.jpg';
        // return response.secure_url;
    } catch (error) {
        console.log('Cloudinary error : ', error);
        return false;
    }
}