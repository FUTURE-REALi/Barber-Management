import StoreService from "../models/storeService.model.js";

export const createStoreService = async (store, service, price, duration,image) => {

    if (!store || !service || !price || !duration) {
        throw new Error('All fields are required');
    }
    
    const newStoreService = new StoreService({
        store,
        service,
        price,
        duration,
        image
    });
    return await newStoreService.save();
}