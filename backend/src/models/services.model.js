import mongoose, { Schema } from "mongoose";

const serviceSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    rating: {
        type: Schema.Types.ObjectId,
        ref: "Rating",
    },
    stores: [{
        type: Schema.Types.ObjectId,
        ref: "Store",
    }]
});

serviceSchema.methods.addStore = function(storeId) {
    this.stores.push(storeId);
    this.save();
}

serviceSchema.methods.removeStore = function(storeId) {
    this.stores = this.stores.filter(store => store.toString() !== storeId.toString());
    this.save();
};

const Service = mongoose.model("Service", serviceSchema);
export default Service;

