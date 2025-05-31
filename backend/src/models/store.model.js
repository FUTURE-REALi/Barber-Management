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
    phone: {
        type: Number,
        required: true
    },
    services: [{
        type: Schema.Types.ObjectId,
        ref: 'Service',
    }],
    openingTime: {
        type: String,
        required: true,
    },
    closingTime: {
        type: String,
        required: true,
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
            required: true
        }
    },
    rating: {
        type: Schema.Types.ObjectId,
        ref: 'Rating',
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review',
    }],
});

storeSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

storeSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
};

storeSchema.methods.generateToken = function(){
    return jwt.sign({_id: this._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRE});
};

storeSchema.methods.toggleStatus = async function(){
    this.status = !this.status;
    await this.save();
    return this.status;
};

storeSchema.methods.addService = async function(serviceId) {
    if (!this.services.includes(serviceId)) {
        this.services.push(serviceId);
        await this.save();
    }
    return this.services;
};


const storeModel = mongoose.model("Store", storeSchema);

export default storeModel;
