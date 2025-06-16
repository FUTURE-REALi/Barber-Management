import mongoose, { Schema } from "mongoose";

const promocodeSchema = new Schema({
    code: { type: String, required: true, unique: true },
    store: { type: Schema.Types.ObjectId, ref: "Store", required: true },
    discount: { type: Number, required: true, min: 1, max: 100 },
    expiry: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Promocode = mongoose.model("Promocode", promocodeSchema);
export default Promocode;