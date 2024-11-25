import mongoose, { Schema } from "mongoose";

const cartSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique:true,
        },
        products: [
            {
                productId: {
                    type: Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                size: {
                    type: String, 
                  },
                  color: {
                    type: String, 
                  },
                quantity: {
                    type: Number,
                    default:1,
                    min:1
                },
            },
        ],
    },
    { timestamps: true, versionKey: false }
);

export default mongoose.model("Cart", cartSchema);