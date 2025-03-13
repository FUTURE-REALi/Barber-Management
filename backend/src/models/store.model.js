import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const storeSchema = new Schema({
    status: {
        type: Boolean,
        default: false,
    },
    storename: {
        type: String,
        required: true,
        unique: true
    },
    ownername:{
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    address: {
        building: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        zip: {
            type: Number,
            required: true,
        }
    },
    phone: {
        type: Number,
        required: true
    },
    services: [{
        type: Schema.Types.ObjectId,
        ref: "Service",
    }],
    openingTime: {
        type: String,
        required: true,
    },
    closingTime: {
        type: String,
        required: true,
    },
});

storeSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

storeSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}

storeSchema.methods.generateToken = function(){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRE});
}

storeSchema.methods.toggleStatus =function(){
    this.status = !this.status;
    return this.status;
}

const storeModel = mongoose.model("Store", storeSchema);

export default storeModel;
