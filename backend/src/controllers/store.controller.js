import storeModel from "../models/store.model.js";
import { validationResult } from "express-validator";
import { createStore } from "../services/store.service.js";
import Service from "../models/services.model.js";
import { createService } from "../services/services.service.js";

export const registerStore = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { storename, ownername, password, email, address, phone} = req.body;


    const alreadyExists = await storeModel.findOne({$or: [{email: email}, {address: address}]});

    if(alreadyExists) {
        return res.status(400).json({error: "Store already exists"});
    }

    try {
        const openingTime ="09:00";
        const closingTime ="21:00";
        const newstore = await createStore(storename, ownername, password, email, address, phone, openingTime, closingTime);
        const token = newstore.generateToken();
        res.cookie('token', token);
        res.status(201).json({token,newstore});
        console.log(newstore);
        console.log(newstore._id);
    } 
    catch (error) {
        return res.status(500).json({error: error.message});
    }
}

export const loginStore = async (req, res, next) => {
    const { email, password } = req.body;

    if(!email || !password) {
        return res.status(400).json({error: "Please fill in all fields"});
    }

    try {
        const store = await storeModel.findOne({email});
        const isMatch = await store.matchPassword(password);
        if(!store || !isMatch) {
            return res.status(400).json({error: "Invalid Credentials"});
        }
        const token = store.generateToken();
        res.cookie('token', token);
        res.status(200).json({token,store});
    } 
    catch (error) {
        return res.status(500).json({error: error.message});
    }
}

export const logoutStore = async (req, res, next) => {
    const token = req.cookies.token || res.headers.authorization.split(' ')[1];

    if(!token){
        return res.status(401).json({message: "You need to login first"});
    }
    
    res.clearCookie('token');
    res.status(200).json({message: "Logged out successfully"});
}

export const toggleStatus = async (req,res,next) => {
    const store = await storeModel.findById(req.store._id);
    if(!store){
        return res.status(404).json({error: "Store not found"});
    }
    const status = store.toggleStatus();
    res.status(200).json({message: "Status updated successfully"});
    return status;
}

export const includedServices = async (req,res,next) => {
    try{
        const store = req.store;
        if(!store){
            return res.status(404).json({error: "Store not found"});
        }
        const listOfServices = req.body.services;
        console.log(listOfServices);

        for(let i=0; i<listOfServices.length; i++){
            let service = await Service.findOne({name: listOfServices[i].name, description: listOfServices[i].description, price: listOfServices[i].price, duration: listOfServices[i].duration});

            if(!service){
                service = await createService(listOfServices[i].name, listOfServices[i].description, listOfServices[i].price, listOfServices[i].duration);
            }

            await store.addService(service._id);

            service.addStore(store._id);
        }
        res.status(200).json({message: "Services added successfully", services: store.services});
        console.log(store.services);
    }
    catch(error){
        return res.status(500).json({error: error.message});
    }
}

export const getStore = async (req,res,next) => {
    try{
        if(!req.store){
            return res.status(404).json({error: "Store not found"});
        }
        res.status(200).json(req.store);
        console.log(req.store);
    }
    catch(error){
        return res.status(500).json({error: error.message});
    }
}

export const getAllStores = async (req, res, next) => {
    try {
        const stores = await storeModel.find().populate('services');
        res.status(200).json({
            message: "Stores retrieved successfully",
            count: stores.length,
            stores: stores
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export const updateStore = async (req, res, next) => {
    try {
        const store = req.store;
        if (!store) {
            return res.status(404).json({ error: "Store not found" });
        }

        const { storename, ownername, email, address, phone, openingTime, closingTime} = req.body;
        const services = req.body.services || [];
        console.log(services);
        if (services.length > 0) {
            for (let i = 0; i < services.length; i++) {
                let service = await Service.findById(services[i]);
                await store.addService(service._id);
                service.addStore(store._id);
            }
        }
        store.storename = storename || store.storename;
        store.ownername = ownername || store.ownername;
        store.email = email || store.email;
        store.address = address || store.address;
        store.phone = phone || store.phone;
        store.openingTime = openingTime || store.openingTime;
        store.closingTime = closingTime || store.closingTime;


        await store.save();

        res.status(200).json({ message: "Store updated successfully", store });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}