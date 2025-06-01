import storeModel from "../models/store.model.js";
import { validationResult } from "express-validator";
import { createStore } from "../services/store.service.js";
import Service from "../models/services.model.js";
import { createService } from "../services/services.service.js";
import { createRating } from "../services/ratings.service.js";
import Rating from "../models/ratings.model.js";

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
    const storeId = req.params.storeId || req.query.storeId;
    
    if (!storeId) {
        return res.status(400).json({ error: "Store ID is required" });
    }

    try {
        const store = await storeModel.findById(storeId).populate('services');
        if (!store) {
            return res.status(404).json({ error: "Store not found" });
        }
        res.status(200).json({ message: "Store retrieved successfully", store });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
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

export const getStorebyServices = async (req, res, next) => {
    try {
        const service  = req.query.service;
        if (!service) {
            return res.status(400).json({ error: "Service ID is required" });
        }
        const serviceId = await Service.findOne({ name: { $regex: `^${service}$`, $options: 'i' } });
        if (!serviceId) {
            return res.status(404).json({ error: "Service not found" });
        }

        const stores = await storeModel.find({ services: serviceId }).populate('services');
        if (stores.length === 0) {
            return res.status(404).json({ message: "No stores found for this service" });
        }

        res.status(200).json({
            message: "Stores retrieved successfully",
            count: stores.length,
            stores: stores
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export const getStoreReviews = async (req, res, next) => {
    const storeId = req.params.storeId || req.query.storeId;
    if (!storeId) {
        return res.status(400).json({ error: "Store ID is required" });
    }

    try {
        const store = await storeModel.findById(storeId).populate('rating');
        const ratings = await Rating.find({ store: storeId }).populate('user service');
        if (!store) {
            return res.status(404).json({ error: "Store not found" });
        }
        res.status(200).json({ message: "Store reviews retrieved successfully", ratings });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export const createStoreReview = async (req, res, next) => {
    const storeId = req.params.storeId || req.query.storeId;
    const serviceId = req.params.serviceId || req.query.serviceId;

    if (!req.user) {
        return res.status(401).json({ error: "You need to be logged in to add a review" });
    }
    if (!serviceId) {
        return res.status(400).json({ error: "Service ID is required" });
    }

    if (!storeId) {
        return res.status(400).json({ error: "Store ID is required" });
    }

    const { reviewText , rating } = req.body;
    if (!reviewText || !rating) {
        return res.status(400).json({ error: "Review and rating are required" });
    }

    try {
        const store = await storeModel.findById(storeId);
        const service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({ error: "Service not found" });
        }
        if (!store) {
            return res.status(404).json({ error: "Store not found" });
        }

        const newRating = await createRating(req.user, service, reviewText, rating, store);
        if (!newRating) {
            return res.status(500).json({ error: "Failed to create review" });
        }

        res.status(201).json({ message: "Review added successfully", rating: newRating });
        console.log("Review added successfully:", newRating);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

export const getStoreAverageRating = async(req, res, next) => {
    const storeId = req.params.storeId || req.query.storeId;
    if (!storeId) {
        return res.status(400).json({ error: "Store ID is required" });
    }

    try {
        const ratings = await Rating.find({ store: storeId });
        if (ratings.length === 0) {
            return res.status(200).json({ average: 0, count: 0, message: "No ratings found for this store" });
        }
        const total = ratings.reduce((acc, rating) => acc + rating.rating, 0);
        const averageRating = total / ratings.length;
        const averageRatingRounded = Math.round(averageRating * 10) / 10; // Round to one decimal place
        res.status(200).json({
            average: averageRatingRounded,
            count: ratings.length,
            message: "Average rating retrieved successfully"
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

