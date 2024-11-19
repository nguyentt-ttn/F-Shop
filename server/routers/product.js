import express from "express";
import { createProduct, deleteProduct, getProduct, getProducts, updateColor, updateProduct, updateVariant } from "../controllers/product";



const productRouter = express.Router();

productRouter.post('/products', createProduct);
productRouter.get('/products', getProducts);
productRouter.get('/products/:id', getProduct);
productRouter.put('/products/:id', updateProduct);
productRouter.delete('/products/:id', deleteProduct);
productRouter.put('/products/:productId/variants/:variantId', updateVariant);
productRouter.put('/products/:productId/variants/:variantId/colors/:colorId', updateColor);


export default productRouter;