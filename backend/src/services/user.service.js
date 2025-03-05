import userModel from "../models/user.model.js";

export const createUser = async (fullname,username,email,password) =>{
    if(!username || !email || !password) {
        throw new Error('All fields are required');
    }
    const newuser = userModel.create({
        fullname,
        username,
        email,
        password
    });
    return newuser;
}