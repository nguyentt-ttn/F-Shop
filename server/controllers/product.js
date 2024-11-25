
import slugify from 'slugify';
import Product from '../models/product';

// Create new product
export const createProduct = async (req, res) => {
    try {
      const productData = { ...req.body };
      
      // Generate slug from name
      productData.slug = slugify(productData.name, { lower: true });
      
      const product = await new Product(productData).save();

      
      res.status(201).json(product);
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: 'Product with this name already exists'
        });
      }
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };
  
  // Get all products with pagination
  export const getProducts = async (req, res) => {
    try {
      const {
        page = 1,
        limit = 10,
        sort = '-createdAt',
        category,
        status,
        minPrice,
        maxPrice
      } = req.query;
  
      const query = {};
  
      // Apply filters
      if (category) query.category = category;
      if (status !== undefined) query.status = status === 'true';
      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
      }
  
      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort,
        populate: 'category'
      };
  
      const products = await Product.paginate(query, options);
  
      res.status(200).json({
        success: true,
        data: products.docs,
        pagination: {
          total: products.totalDocs,
          pages: products.totalPages,
          page: products.page,
          limit: products.limit
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };
  
  // Get single product by ID or slug
  export const getProduct = async (req, res) => {
    try {
      const query = req.params.id.match(/^[0-9a-fA-F]{24}$/) 
        ? { _id: req.params.id }
        : { slug: req.params.id };
  
      const product = await Product.findOne(query).populate('category');
      
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }
  
      res.status(200).json({
        success: true,
        data: product
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };
  
  // Update product
  export const updateProduct = async (req, res) => {
    try {
      const updateData = { ...req.body };
      
      // Update slug if name is changed
      if (updateData.name) {
        updateData.slug = slugify(updateData.name, { lower: true });
      }
  
      const product = await Product.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      ).populate('category');
  
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }
  
      res.status(200).json({
        success: true,
        data: product
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: 'Product with this name already exists'
        });
      }
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };
  
  // Delete product
  export const deleteProduct = async (req, res) => {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
  
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }
  
      res.status(200).json({
        success: true,
        message: 'Product deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };
  
  // Update product variant
  export const updateVariant = async (req, res) => {
    try {
      const { productId, variantId } = req.params;
      const updateData = req.body;
  
      const product = await Product.findById(productId);
  
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }
  
      const variantIndex = product.variants.findIndex(v => v.id === variantId);
  
      if (variantIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Variant not found'
        });
      }
  
      product.variants[variantIndex] = {
        ...product.variants[variantIndex].toObject(),
        ...updateData
      };
  
      await product.save();
  
      res.status(200).json({
        success: true,
        data: product
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };
  
  // Update color in variant
  export const updateColor = async (req, res) => {
    try {
      const { productId, variantId, colorId } = req.params;
      const updateData = req.body;
  
      const product = await Product.findById(productId);
  
      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }
  
      const variant = product.variants.find(v => v.id === variantId);
  
      if (!variant) {
        return res.status(404).json({
          success: false,
          message: 'Variant not found'
        });
      }
  
      const colorIndex = variant.colors.findIndex(c => c.id === colorId);
  
      if (colorIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Color not found'
        });
      }
  
      variant.colors[colorIndex] = {
        ...variant.colors[colorIndex].toObject(),
        ...updateData
      };
  
      await product.save();
  
      res.status(200).json({
        success: true,
        data: product
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  };






// import { StatusCodes } from "http-status-codes";
// import Attribute from "../models/attribute";
// import Product from "../models/product";
// import { productSchema } from "../utils/validators/product";
// import slugify from 'slugify';


// export const createProduct = async (req, res) => {
//     try {
//         const { error, value } = productSchema.validate(req.body);
//         if (error) {
//             return res.status(StatusCodes.BAD_REQUEST).json({ message: error.details[0].message });
//         }
//         const { name,attributes } = value;
//         console.log('attributes:', attributes);

//         const existingProduct = await Product.findOne({ name });
//         if (existingProduct) {
//             return res.status(StatusCodes.BAD_REQUEST).json({ message: "Sản phẩm với tên này đã tồn tại" });
//         }

        
//         console.log('attributes (before query):', attributes);
// const productAttributes = await Attribute.find({ _id: { $in: attributes } });
// console.log('productAttributes (after query):', productAttributes);

// const allAttributes = await Attribute.find({});
// console.log('All Attributes:', allAttributes);

//         if (productAttributes.length !== attributes.length) {
//             return res
//                 .status(StatusCodes.BAD_REQUEST)
//                 .json({ message: "Một hoặc nhiều thuộc tính không tìm thấy" });
//         }

//         // Tạo slug từ tên sản phẩm
//         const slug = slugify(name, { lower: true });

//         const product = await Product.create({ ...value, slug });
//         res.status(StatusCodes.CREATED).json(product);
//     } catch (error) {
//         res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
//     }
// };

// export const getProductById = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { _embed } = req.query;
        
//         const product = await Product.findById(id).populate(_embed ? _embed.split(",") : []);
//         if (!product) {
//             return res.status(StatusCodes.NOT_FOUND).json({ message: "Sản phẩm không tồn tại" });
//         }

//         res.status(StatusCodes.OK).json(product);
//     } catch (error) {
//         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
//     }
// };

// export const getProducts = async (req, res) => {
//     try {
//         const { _page = 1, _limit = 10, _embed } = req.query;
//         const options = {
//             page: parseInt(_page, 10),
//             limit: parseInt(_limit, 10),
//         };

//         let query = Product.find();

//         if (_embed) {
//             const embeds = _embed.split(",");
//             embeds.forEach((embed) => {
//                 query = query.populate(embed);
//             });
//         }

//         const result = await Product.paginate(query, options);
//         const { docs, ...paginationData } = result; 

//         return res.status(StatusCodes.OK).json({
//             products: docs,
//             ...paginationData,
//         });
//     } catch (error) {
//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
//     }
// };

// export const updateProduct = async (req, res) => {
//     try {
//         const { error, value } = productSchema.validate(req.body);
//         if (error) {
//             return res.status(StatusCodes.BAD_REQUEST).json({ message: error.details[0].message });
//         }

//         const { id } = req.params;
//         const product = await Product.findByIdAndUpdate(id, value, {
//             new: true,
//         });
//         if (!product) {
//             return res
//                 .status(StatusCodes.NOT_FOUND)
//                 .json({ message: "Không tìm thấy sản phẩm nào" });
//         }
//         res.status(StatusCodes.OK).json(product);
//     } catch (error) {
//         res.status(StatusCodes.BAD_REQUEST).json({ message: error.message });
//     }
// };

// export const deleteProduct = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const product = await Product.findByIdAndDelete(id);
//         if (!product) {
//             return res
//                 .status(StatusCodes.NOT_FOUND)
//                 .json({ message: "Không tìm thấy sản phẩm nào" });
//         }
//         res.status(StatusCodes.OK).json({ message: "Xóa sản phẩm thành công" });
//     } catch (error) {
//         res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: error.message });
//     }
// };