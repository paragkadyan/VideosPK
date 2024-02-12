import {v2 as cloudinary} from 'cloudinary';
import fs from "fs"



cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY 
});


const uploadOnCloudinary = async (localFilePath) => {
    
    try{
        if(!localFilePath) return null;
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        console.log("file uploaded successfully", response.url);
        fs.unlinkSync(localFilePath)
        return response.url;
    } catch(err){
        fs.unlinkSync(localFilePath)
        console.log("cloudinary upload error ", err)
        return null;
    }
}


export {uploadOnCloudinary}
