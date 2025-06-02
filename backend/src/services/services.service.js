import Service from "../models/services.model.js";

export const createService = async (name, description) => {
    if(!name || !description) {
        throw new Error('All fields are required');
    }
    const newService = Service.create({
        name,
        description,
    });
    return newService;
}
