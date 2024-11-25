import express from "express";
import { createInvoice, getInvoiceById, getInvoicesByUserId, updateInvoiceStatus } from "../controllers/invoice";

const invoiceRouter = express.Router();

invoiceRouter.post("/invoice", createInvoice); // Tạo hóa đơn mới
invoiceRouter.get("/invoice/:userId", getInvoicesByUserId); // Lấy danh sách hóa đơn theo userId
invoiceRouter.get("/invoice/detail/:invoiceId", getInvoiceById); // Lấy chi tiết hóa đơn theo id
invoiceRouter.put("/invoice/status/:invoiceId", updateInvoiceStatus); // Cập nhật trạng thái hóa đơn

export default invoiceRouter;
