import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const ColorSchema = new mongoose.Schema({
 
  color: { type: String, required: true },
  quantity: { type: Number, required: true, min: 0 },
});

const ProductVariantSchema = new mongoose.Schema({
  
  size: { type: String, required: true },
  colors: [ColorSchema],
});

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      unique: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
    },

    image_urls: {
      type: [String],
      required: true,
    },
    image_urls: {
      type: [String],
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    description: {
      type: String,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
    },
    reviews: {
      type: Number,
      default: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    tags: [String],
    sku: {
      type: String,
      // required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    variants: [ProductVariantSchema],
  },
  {
    timestamps: true,
    versionKey:false,
    toObject: {
      transform: function(doc, ret) {
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

ProductSchema.plugin(mongoosePaginate);

export default mongoose.model("Product", ProductSchema);
// import mongoose from "mongoose";
// import mongoosePaginate from "mongoose-paginate-v2";

// const ProductSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//       minlength: 3,
//       unique: true,
//     },
//     slug: {
//       type: String,
//       unique: true,
//     },
//     price: {
//       type: Number,
//       required: true,
//     },
//     image_urls: {
//       type: [String],
//       required: true,
//     },
//     attributes: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Attribute",
//         required: true,
//       },
//     ],
//     quantity: {
//       type: Number,
//       default: 1,
//     },
//     description: {
//       type: String,
//     },
//     rating: {
//       type: Number,
//       min: 0,
//       max: 5,
//     },
//     reviews: {
//       type: Number,
//       default: 0,
//     },
//     category: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Category",
//     },
//     tags: [String],
//     sku: {
//       type: String,
//       // required: true,
//     },
//     status: {
//       type: Boolean,
//       default: true,
//     },
//   },
//   { timestamps: true, versionKey: false }
// );

// ProductSchema.plugin(mongoosePaginate);

// export default mongoose.model("Product", ProductSchema);
