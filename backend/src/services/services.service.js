import Service from "../models/services.model.js";

export const createService = async (name, description, price, duration) => {
    if(!name || !description || !price || !duration) {
        throw new Error('All fields are required');
    }
    const newService = Service.create({
        name,
        description,
        price,
        duration
    });
    return newService;
}
