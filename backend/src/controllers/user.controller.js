import userModel from "../models/user.model.js";
import { validationResult } from "express-validator";
import { createUser } from "../services/user.service.js";

export const registerUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, username, email, password } = req.body;

    if (!fullname || !username || !email || !password) {
        return res.status(400).json({ message: "Please fill in all fields" });
    }

    const isAlreadyUser = await userModel.findOne({ $or: [{ email: email }, { username: username }] });

    if (isAlreadyUser) {
        return res.status(400).json({ message: "User already exists" });
    }

    try {
        const newUser = await createUser(fullname, username, email, password);
        const token = newUser.generateToken();
        res.cookie('token', token);
        res.status(201).json({ token, newUser });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const loginUser = async (req, res, next) => {
    const { email, password, username} = req.body;

    if((!email || !username) && !password){
        return res.status(400).json({message: "Please fill in all fields"});
    }

    try{
        const user = await userModel.findOne({$or: [{email: email}, {username: username}]});
        if(!user){
            return res.status(400).json({message: "User does not exist"});
        }

        const isMatch = await user.matchPassword(password);
        if(!isMatch){
            return res.status(400).json({message: "Invalid credentials"});
        }

        const token = user.generateToken();
        res.cookie('token', token);
        res.status(200).json({token, user});
    }
    catch(error){
        res.status(500).json({message: error.message});
    }
}

export const logoutUser = async (req, res, next) => {
    res.clearCookie('token');
    res.status(200).json({message: "Logged out successfully"});
}

