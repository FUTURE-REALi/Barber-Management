import userModel from "../models/user.model.js";
import storeModel from "../models/store.model.js";
import jwt from "jsonwebtoken";

export const authUser = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded._id);
        req.user = user;
        return next();
    }
    catch (err) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

export const authStore = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const store = await storeModel.findById(decoded._id);
        req.store = store;
        return next();
    }
    catch (err) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}