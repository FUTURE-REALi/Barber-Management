import Service from "../models/services.model.js";
import { createStore } from "../services/services.service.js";

export const insertService = async (req, res, next) => {
    const {name, description, price, duration} = req.body;
    if(!name || !description || !price || !duration) {
        return res.status(400).json({error: "All fields are required"});
    }
    
    const isAlreadyService = await Service.findOne({name:name,description:description,price:price,duration:duration});

    if(isAlreadyService) {
        return res.status(400).json({error: "Service already exists"});
    }

    try {
        const service = await createStore(name,description,price,duration);
        console.log(service);
        res.status(201).json(service);
    }
    catch (error) {
        return res.status(500).json({error: error.message});
    }

}

export const getServices = async (req, res, next) => {
    try {
        const services = await Service.find();
        res.status(200).json(services);
    }
    catch (error) {
        return res.status(500).json({error: error.message});
    }
}
