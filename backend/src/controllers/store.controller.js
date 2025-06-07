import storeModel from "../models/store.model.js";
import { validationResult } from "express-validator";
import { createStore } from "../services/store.service.js";
import Service from "../models/services.model.js";
import { createService } from "../services/services.service.js";
import { createRating } from "../services/ratings.service.js";
import Rating from "../models/ratings.model.js";
import StoreService from "../models/storeService.model.js";
import { createStoreService } from "../services/storeService.service.js";
import { addStoreService, getStoreServices} from "./storeService.controller.js";

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
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            path: '/',
        });
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
        res.cookie('token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            path: '/',
        });
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
            
            let service = await Service.findOne({name: listOfServices[i].name});

            if(!service){
                service = await createService(listOfServices[i].name, listOfServices[i].description);
            }

            let storeService = await storeService.findOne({name: listOfServices[i].name, store: store._id, service: service._id});

            if(!storeService){
                storeService = await createStoreService(store._id, service._id, listOfServices[i].price, listOfServices[i].duration);
            }
            
            await store.addService(storeService._id);

            storeService.addStore(store._id);
            service.addStore(store._id);
        }
        res.status(200).json({message: "Services added successfully", services: store.storeService});
        console.log(store.storeService);
    }
    catch(error){
        return res.status(500).json({error: error.message});
    }
}

export const getStore = async (req, res, next) => {
    const storeId = req.params.storeId || req.query.storeId;

    if (!storeId) {
        return res.status(400).json({ error: "Store ID is required" });
    }

    try {
        const store = await storeModel.findById(storeId)
            .populate({
                path: 'services',
                populate: {
                    path: 'service',
                    model: 'Service',
                    select: 'name description'
                },
                select: 'service price duration'
            })
            .populate('rating');
        if (!store) {
            return res.status(404).json({ error: "Store not found" });
        }
        res.status(200).json({ message: "Store retrieved successfully", store });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const getAllStores = async (req, res, next) => {
    try {
        const stores = await storeModel.find().populate({
            path: 'services',
            populate: {
                path: 'service',
                model: 'Service',
                select: 'name description'
            },
            select: 'service price duration'
        });
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

        const { storename, ownername, email, address, phone, openingTime, closingTime, services = [] } = req.body;

        // Update basic fields
        store.storename = storename || store.storename;
        store.ownername = ownername || store.ownername;
        store.email = email || store.email;
        store.address = address || store.address;
        store.phone = phone || store.phone;
        store.openingTime = openingTime || store.openingTime;
        store.closingTime = closingTime || store.closingTime;

        // Handle services update (expects array of {serviceId, price, duration})
        if (Array.isArray(services) && services.length > 0) {
            for (let i = 0; i < services.length; i++) {
                const { serviceId, price, duration } = services[i];
                let service = await Service.findById(serviceId);
                if (!service) continue;

                // Check if StoreService already exists
                let storeService = await StoreService.findOne({
                    store: store._id,
                    service: service._id
                });

                if (!storeService) {
                    // Create new StoreService
                    storeService = await StoreService.create({
                        store: store._id,
                        service: service._id,
                        price,
                        duration
                    });
                    // Add to store's services array if not present
                    if (!store.services.includes(storeService._id)) {
                        store.services.push(storeService._id);
                    }
                } else {
                    // Update price/duration if changed
                    if (price) storeService.price = price;
                    if (duration) storeService.duration = duration;
                    await storeService.save();
                }
            }
        }

        await store.save();

        // Populate services for response
        const updatedStore = await storeModel.findById(store._id).populate({
            path: 'services',
            populate: {
                path: 'service',
                model: 'Service',
                select: 'name description'
            },
            select: 'service price duration'
        });

        res.status(200).json({ message: "Store updated successfully", store: updatedStore });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
};

export const getStorebyServices = async (req, res, next) => {
    try {
        const serviceName = req.query.service;
        if (!serviceName) {
            return res.status(400).json({ error: "Service name is required" });
        }

        // Find the service by name (case-insensitive)
        const service = await Service.findOne({ name: { $regex: `^${serviceName}$`, $options: 'i' } });
        if (!service) {
            return res.status(404).json({ error: "Service not found" });
        }

        // Find all StoreService entries for this service
        const storeServices = await StoreService.find({ service: service._id });
        const storeServiceIds = storeServices.map(ss => ss._id);

        // Find all stores that have these StoreService references
        const stores = await storeModel.find({ services: { $in: storeServiceIds } })
            .populate({
                path: 'services',
                populate: {
                    path: 'service',
                    model: 'Service',
                    select: 'name description'
                },
                select: 'service price duration'
            });

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
};

export const getStoreReviews = async (req, res, next) => {
    const storeId = req.params.storeId || req.query.storeId;
    if (!storeId) {
        return res.status(400).json({ error: "Store ID is required" });
    }

    try {
        const store = await storeModel.findById(storeId);
        if (!store) {
            return res.status(404).json({ error: "Store not found" });
        }
        // Get all ratings for this store, populate user and service details
        const ratings = await Rating.find({ store: storeId })
            .populate('user', 'name email')
            .populate('service', 'name description');
        res.status(200).json({ message: "Store reviews retrieved successfully", ratings });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

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

    const { reviewText, rating } = req.body;
    if (!reviewText || typeof rating === "undefined") {
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

        // Prevent duplicate review by same user for same service/store (optional)
        // const existing = await Rating.findOne({ user: req.user._id, store: storeId, service: serviceId });
        // if (existing) return res.status(400).json({ error: "You have already reviewed this service at this store." });

        const newRating = await createRating(req.user._id, service._id, reviewText, rating, store._id, new Date());
        if (!newRating) {
            return res.status(500).json({ error: "Failed to create review" });
        }

        res.status(201).json({ message: "Review added successfully", rating: newRating });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const getStoreAverageRating = async (req, res, next) => {
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
};

export const getStoreProfile = async (req, res, next) => {
    const store = req.store;
    if (!store) {
        return res.status(404).json({ error: "Store not found" });
    }
    try {
        const storeProfile = await storeModel.findById(store._id)
            .populate({
                path: 'services',
                populate: {
                    path: 'service',
                    model: 'Service',
                    select: 'name description'
                },
                select: 'service price duration'
            })
            .populate('rating');
        if (!storeProfile) {
            return res.status(404).json({ error: "Store profile not found" });
        }
        res.status(200).json({ message: "Store profile retrieved successfully", store: storeProfile });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

