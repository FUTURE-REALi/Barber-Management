import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    fullname:{
        type: String,
        required: true
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
    address: [{
        building: {
            type: String,
        },
        street: {
            type: String,
        },
        city: {
            type: String,
        },
        state: {
            type: String,
        },
    }],
    ratings: [{
        type: Schema.Types.ObjectId,
        ref: "Rating"
    }],
    bookings: [{
        type: Schema.Types.ObjectId,
        ref: "Booking"
    }],
    cart: {
        type: Schema.Types.ObjectId,
        ref: "OrderCart"
    },
    image: {
        type: String,
        default: ""
    }
});

userSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

userSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateToken = function() {
    return jwt.sign({_id: this._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRE});
};


const userModel = mongoose.model("User", userSchema);

export default userModel;
