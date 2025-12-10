import Service from "../models/services.model.js";

export const createService = async (name, description,image) => {
    if(!name || !description) {
        throw new Error('All fields are required');
    }
    const newService = Service.create({
        name,
        description,
        image
    });
    return newService;
}
