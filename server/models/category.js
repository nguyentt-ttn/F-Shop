import mongoose from "mongoose";
import { mongoosePaginate } from "mongoose-paginate-v2";

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      unique: true,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true, versionKey: false }
);
// categorySchema.plugin(mongoosePaginate);
export default mongoose.model("Category", CategorySchema);
