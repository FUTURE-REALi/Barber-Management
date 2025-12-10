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
    store: {
        type: Schema.Types.ObjectId,
        ref: "Store",
    },
    image: {
        type: Schema.Types.ObjectId,
        ref: "MultipleCloud",
    }
});

serviceSchema.methods.addStore = async function (storeId) {
    if (!storeId) {
        throw new Error("Store ID is required");
    }
    this.store = storeId;
    return await this.save();
}

const Service = mongoose.model("Service", serviceSchema);
export default Service;

