import Service from "../models/services.model.js";
import { createService } from "../services/services.service.js";

export const insertService = async (req, res, next) => {
    const {name, description} = req.body;
    if(!name || !description) {
        return res.status(400).json({error: "All fields are required"});
    }
    
    const isAlreadyService = await Service.findOne({name:name});

    if(isAlreadyService) {
        return res.status(201).json(isAlreadyService);
    }

    try {
        const service = await createService(name,description);
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
