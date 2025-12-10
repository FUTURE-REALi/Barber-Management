import getDataUri from "../services/bufferGenerator.service.js";
import cloudinary from 'cloudinary';
import { createCloudEntry } from "../services/cloud.service.js";

export const uploadFileToCloud = async(files) => {
    try{
        if (!files || files.length === 0) {
            return new Error('No files to upload');
        }

        const imageUploadPromises = files.map(async(files) => {
            const filebuffer = getDataUri(files);
            const result = await cloudinary.v2.uploader.upload(filebuffer.content);

            return {
                url: result.secure_url,
                id: result.public_id
            };
        });
    
        const uploadedImages = await Promise.all(imageUploadPromises);
        const imageData = createCloudEntry(uploadedImages);
        return imageData;
    }
    catch (error) {
        console.error("Error uploading files to Cloudinary:", error);
        throw new Error("Internal server error");
    }
};
export const uploadToCloud = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "No files uploaded" });
        }

        const files = req.files;
        const imageUploadPromises = files.map(async(files) => {
            const filebuffer = getDataUri(files);
            const result = await cloudinary.v2.uploader.upload(filebuffer.content);

            return {
                url: result.secure_url,
                id: result.public_id
            };
        });
    
        const uploadedImages = await Promise.all(imageUploadPromises);
        const imageData = createCloudEntry(uploadedImages);
        res.status(200).json({
            message: "Files uploaded successfully",
            data: imageData
        });
         
        return imageData;
    } catch (error) {
        console.error("Error uploading files to Cloudinary:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
