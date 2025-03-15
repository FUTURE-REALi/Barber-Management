import storeModel from "../models/store.model.js";

export const createStore = async (storename, ownername, password, email, address, phone,openingTime,closingTime) => {
    if(!storename || !ownername || !password || !email || !address || !phone || !openingTime || !closingTime) {
        throw new Error('All fields are required');
    }
    const newstore = storeModel.create({
        storename,
        ownername,
        password,
        email,
        address,
        phone,
        openingTime,
        closingTime
    });
    return newstore;
}
