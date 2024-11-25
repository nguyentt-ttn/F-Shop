import express from "express";
import {
  addProductToCart,
  decreaseProductQuantity,
  deleteCart,
  getCartByUserId,
  increaseProductQuantity,
  removeProductFromCart,
  updateProductQuantity,
} from "./../controllers/cart";

const cartRouter = express.Router();
cartRouter.get("/cart/:userId", getCartByUserId);
cartRouter.post("/cart/:userId", addProductToCart);
cartRouter.put("/cart", updateProductQuantity);
cartRouter.delete('/cart/remove', removeProductFromCart);
cartRouter.delete("/cart/:userId", deleteCart);
// Tăng số lượng sản phẩm
cartRouter.post("/cart/increase", increaseProductQuantity);

// Giảm số lượng sản phẩm
cartRouter.patch("/cart/decrease", decreaseProductQuantity);

export default cartRouter;
