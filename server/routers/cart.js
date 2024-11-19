import express from "express";
import { addItemToCart, decreaseProductQuantity, getCartByUserId, increaseProductQuantity, removeItemFromCart } from "../controllers/cart";


const cartRouter = express.Router();

// Route để lấy giỏ hàng của người dùng
cartRouter.get("/cart/:userId", getCartByUserId);

cartRouter.post("/cart", addItemToCart);

// Route để tăng số lượng sản phẩm trong giỏ hàng
cartRouter.put("/cart/increase", increaseProductQuantity);

// Route để giảm số lượng sản phẩm trong giỏ hàng
cartRouter.put("/cart/decrease", decreaseProductQuantity);

cartRouter.delete("/cart", removeItemFromCart);

export default cartRouter;