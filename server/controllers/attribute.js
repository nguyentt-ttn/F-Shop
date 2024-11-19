import { StatusCodes } from "http-status-codes";
import Attribute from "../models/attribute";

export const createOrUpdateAttribute = async (req, res) => {
    try {
      // Tìm attribute đã tồn tại
      const existingAttribute = await Attribute.findOne({ name: req.body.name });
  
      if (existingAttribute) {
        // Nếu tồn tại, cập nhật thuộc tính
        existingAttribute.value = req.body.value;
        existingAttribute.type = req.body.type;
        // Cập nhật các trường khác nếu cần
  
        await existingAttribute.save();
  
        return res.status(200).json({
          message: "Attribute updated successfully",
          data: existingAttribute,
        });
      }
  
      // Nếu không tồn tại, tạo mới attribute
      const newAttribute = new Attribute(req.body);
      await newAttribute.save();
  
      res.status(201).json({
        message: "Attribute created successfully",
        data: newAttribute,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  };
  
// export const createAttribute = async (req, res) => {
//   try {
//     // Kiểm tra nếu attribute với name đã tồn tại
//     const existingAttribute = await Attribute.findOne({ name: req.body.name });

//     if (existingAttribute) {
//       return res.status(400).json({
//         message: `Attribute with name "${req.body.name}" already exists.`,
//       });
//     }

//     // Nếu không tồn tại, tạo mới attribute
//     const newAttribute = new Attribute(req.body);
//     await newAttribute.save();

//     res.status(StatusCodes.CREATED).json({
//       message: "Attribute created successfully",
//       data: newAttribute,
//     });
//   } catch (error) {
//     res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
//   }
// };

export const getAttributes = async (req, res) => {
  try {
    const attributes = await Attribute.find();
    res.status(StatusCodes.OK).json(attributes);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

export const getAttributeById = async (req, res) => {
  try {
    const attribute = await Attribute.findById(req.params.id);
    if (!attribute) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Attribute not found" });
    }
    res.status(StatusCodes.OK).json(attribute);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

export const updateAttribute = async (req, res) => {
  try {
    const attribute = await Attribute.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!attribute) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Attribute not found" });
    }
    res.status(StatusCodes.OK).json(attribute);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
  }
};

export const deleteAttribute = async (req, res) => {
  try {
    const attribute = await Attribute.findByIdAndDelete(req.params.id);
    if (!attribute) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Attribute not found" });
    }
    res
      .status(StatusCodes.OK)
      .json({ message: "Attribute deleted successfully" });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};
