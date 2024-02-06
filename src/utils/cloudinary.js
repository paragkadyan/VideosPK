import {v2 as cloudinary} from 'cloudinary';
import { log } from 'console';
import fs from "fs"

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY 
});


const uploadOnCloudinary = async (localpath) => {
    try{
        if(!localpath) return null;
        const response = await cloudinary.uploader.upload(localfilepath, {
            resource_type: "auto"
        })
        console.log("file uploaded successfully", response.url);
        return response;
    } catch(err){
        fs.unlinkSync(localpath)
        console.log("cloudinary error ", err)
        return null;
    }
}


export {uploadOnCloudinary}
