import Service from "../models/services.model.js";
import { createService } from "../services/services.service.js";
import { uploadFileToCloud } from "./cloud.controller.js";

export const insertService = async (req, res, next) => {

    const {name, description} = req.body;
    const image = await uploadFileToCloud(req.files);

    if(!name || !description) {
        return res.status(400).json({error: "All fields are required"});
    }
    
    const isAlreadyService = await Service.findOne({name:name});

    if(isAlreadyService) {
        return res.status(201).json({ service: isAlreadyService, image });
    }

    try {
        const service = await createService(name,description,image);
        res.status(201).json({ service, image });
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
