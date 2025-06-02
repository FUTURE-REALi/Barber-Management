import mongoose,{Schema} from "mongoose";

const storeServiceSchema = new Schema({
    store: {
        type: Schema.Types.ObjectId,
        ref: "Store",
        required: true
    },
    service: {
        type: Schema.Types.ObjectId,
        ref: "Service",
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    rating: {
        type: Schema.Types.ObjectId,
        ref: "Rating",
    },
});

storeServiceSchema.methods.addStore = async function (storeId) {
    if (!storeId) {
        throw new Error("Store ID is required");
    }
    this.store = storeId;
    return await this.save();
}
const StoreService = mongoose.model("StoreService", storeServiceSchema);
export default StoreService;