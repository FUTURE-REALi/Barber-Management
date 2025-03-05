import storeModel from "../models/store.model.js";

export const createStore = async (storename, ownername, password, email, address, phone) => {
    if(!storename || !ownername || !password || !email || !address || !phone) {
        throw new Error('All fields are required');
    }
    const newstore = storeModel.create({
        storename,
        ownername,
        password,
        email,
        address,
        phone
    });
    return newstore;
}
