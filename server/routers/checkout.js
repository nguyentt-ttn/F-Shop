import express from "express";
import { createCheckout, deleteCheckout, getAllCheckouts, getCheckoutById, updateCheckoutStatus } from "../controllers/checkout";

const checkoutRouter = express.Router();

// Tạo đơn thanh toán
checkoutRouter.post("/checkout", createCheckout);

// Lấy danh sách tất cả các đơn thanh toán
checkoutRouter.get("/checkout", getAllCheckouts);

// Lấy thông tin chi tiết 1 đơn thanh toán
checkoutRouter.get("/checkout/:id", getCheckoutById);

// Cập nhật trạng thái đơn hàng
checkoutRouter.put("/checkout/:id", updateCheckoutStatus);

// Xóa đơn thanh toán
checkoutRouter.delete("/checkout/:id", deleteCheckout);

export default checkoutRouter;
