import StoreService from '../services/storeService.service.js';

export const addStoreService = async (req,res) => {
    const {store, service, price, duration} = req.body;
    if(!store || !service || !price || !duration) {
        return res.status(400).json({message: 'All fields are required'});
    }
    try {
        const exists = await StoreService.findStoreService(store, service);
        if(exists) {
            return res.status(400).json({message: 'Service already exists for this store'});
        }
        const newStoreService = await StoreService.createStoreService(store, service, price, duration);
        return res.status(201).json(newStoreService);
    }
    catch (error) {
        return res.status(500).json({message: error.message});
    }
};

export const getStoreServices = async (req, res) => {
    const {store} = req.params;
    if(!store) {
        return res.status(400).json({message: 'Store ID is required'});
    }
    try {
        const services = await StoreService.find({store})
            .populate('service', 'name description')
            .select('price duration service');
        return res.status(200).json(services);
    }
    catch (error) {
        return res.status(500).json({message: error.message});
    }
}