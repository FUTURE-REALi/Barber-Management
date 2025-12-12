import getDataUri from "../services/bufferGenerator.service.js";
import cloudinary from 'cloudinary';
import { createMultipleCloudEntry, createSingleCloudEntry } from "../services/cloud.service.js";
import { MultipleCloud, SingleCloud } from "../models/cloud.model.js";

export const uploadMultipleFileToCloud = async(files) => {
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
        const imageData = createMultipleCloudEntry(uploadedImages);
        return imageData;
    }
    catch (error) {
        console.error("Error uploading files to Cloudinary:", error);
        throw new Error("Internal server error");
    }
};

export const uploadSingleFileToCloud = async(file) => {
    try{
        if (!file) {
            return new Error('No file to upload');
        }
        const filebuffer = getDataUri(file);
        const result = await cloudinary.v2.uploader.upload(filebuffer.content);
        const uploadedImage = await Promise.resolve({
            url: result.secure_url,
            id: result.public_id
        });
        const imageData = await createSingleCloudEntry(uploadedImage);
        return imageData;
    }
    catch (error) {
        console.error("Error uploading file to Cloudinary:", error);
        throw new Error("Internal server error");
    }
}
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

export const getSingleFileFromCloud = async (req, res) => {
    try{
        if(!req.params.id){
            return res.status(400).json({message: "No file id provided"});
        }
        const fileId = req.params.id;
        const file = await SingleCloud.findById(fileId);
        const url = file.url;
        res.status(200).json({
            message: "File fetched successfully",
            data: url,
        });
    }
    catch (error) {
        console.error("Error fetching file from Cloudinary:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const getMultipleFilesFromCloud = async (req, res) => {
    try{
        if(!req.params.id){
            return res.status(400).json({message: "No file id provided"});
        }
        const fileId = req.params.id;
        const files = await MultipleCloud.findById(fileId);
        const urls = files.image.map(img => img.url);
        res.status(200).json({
            message: "Files fetched successfully",
            data: urls,
        });
    }   
    catch (error) {
        console.error("Error fetching files from Cloudinary:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
