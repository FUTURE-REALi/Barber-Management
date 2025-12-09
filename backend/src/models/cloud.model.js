import mongoose, { Schema } from "mongoose";

const multipleCloudSchema = Schema({
    image: [
        {
            url: { type: String, required: true },
            id: { type: String, required: true },
        }
    ]
});

const MultipleCloud = mongoose.model("MultipleCloud", multipleCloudSchema);
export default MultipleCloud;