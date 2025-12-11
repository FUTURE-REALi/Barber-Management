import {MultipleCloud, SingleCloud} from "../models/cloud.model.js";

export const createMultipleCloudEntry = async (images) => {
    if (!images || images.length === 0) {
        throw new Error('At least one image is required');
    }

    const newCloudEntry = new MultipleCloud({
        image: images
    });
    await newCloudEntry.save();
    return newCloudEntry;
}

export const createSingleCloudEntry = async (image) => {
    if (!image) {
        throw new Error('Image is required');
    }
    const newCloudEntry = new SingleCloud({
        ...image
    });
    await newCloudEntry.save();
    return newCloudEntry;
}