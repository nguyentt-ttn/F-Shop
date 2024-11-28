import express from "express";
import { createCheckout, deleteCheckout, getAllCheckouts, getCheckoutById, updateCheckoutStatus } from "../controllers/checkout";

const checkoutRouter = express.Router();
checkoutRouter.post("/checkout", createCheckout);
checkoutRouter.get("/checkout", getAllCheckouts);
checkoutRouter.get("/checkout/:id", getCheckoutById);
checkoutRouter.put("/checkout/:id", updateCheckoutStatus);
checkoutRouter.delete("/checkout/:id", deleteCheckout);

export default checkoutRouter;
