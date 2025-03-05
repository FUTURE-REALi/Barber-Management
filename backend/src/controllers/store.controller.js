import storeModel from "../models/store.model.js";
import { validationResult } from "express-validator";
import { createStore } from "../services/store.service.js";

export const registerStore = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { storename, ownername, password, email, address, phone } = req.body;



    const alreadyExists = await storeModel.findOne({$or: [{email: email}, {address: address}]});

    if(alreadyExists) {
        return res.status(400).json({error: "Store already exists"});
    }

    try {
        const newstore = await createStore(storename, ownername, password, email, address, phone);
        const token = newstore.generateToken();
        res.cookie('token', token);
        res.status(201).json(newstore);
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
        if(!store) {
            return res.status(400).json({error: "Store does not exist"});
        }

        const isMatch = await store.matchPassword(password);
        if(!isMatch) {
            return res.status(400).json({error: "Invalid credentials"});
        }

        const token = store.generateToken();
        res.cookie('token', token);
        res.status(200).json(store);
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