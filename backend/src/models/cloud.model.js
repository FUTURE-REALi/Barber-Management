import mongoose, { Schema } from "mongoose";

const multipleCloudSchema = Schema({
    image: [
        {
            url: { type: String, required: true },
            id: { type: String, required: true },
        }
    ]
});

const singleCloudSchema = Schema({
    url: { type: String, required: true },
    id: { type: String, required: true },
})

export const SingleCloud = mongoose.model("SingleCloud", singleCloudSchema);
export const MultipleCloud = mongoose.model("MultipleCloud", multipleCloudSchema);
