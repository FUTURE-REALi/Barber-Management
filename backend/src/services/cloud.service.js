import MultipleCloud from "../models/cloud.model.js";

export const createCloudEntry = async (images) => {
    if (!images || images.length === 0) {
        throw new Error('At least one image is required');
    }

    const newCloudEntry = new MultipleCloud({
        image: images
    });
    await newCloudEntry.save();
    return newCloudEntry;
}