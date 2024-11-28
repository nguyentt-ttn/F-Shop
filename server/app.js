import express from "express";
import cors from "cors";
import { connectDB } from "./config/db";
import categoryRouter from "./routers/category";
import morgan from "morgan";
import "dotenv/config";
import attributeRouter from "./routers/attribute";
import productRouter from "./routers/product";
import cartRouter from "./routers/cart";
import checkoutRouter from "./routers/checkout";
import authRouter from "./routers/auth";
import paymentRouter from "./routers/payment";
const app = express();
// app.use(
//   cors({
//     origin: "*", // Cho phép tất cả các origin
//     credentials: true, // Cho phép gửi cookie và thông tin xác thực
//     methods: ["*"], // Cho phép tất cả các phương thức HTTP
//   })
// );

app.use(
  cors({
    origin: "*", 
    credentials: true, 
    methods: "*", 
    allowedHeaders: ["Content-Type", "Authorization"], // Cho phép các header nhất định
  })
);
app.use(morgan("dev"));
app.use(express.json());

//routers
app.use("/api", productRouter);
app.use("/api", authRouter);
app.use("/api", categoryRouter);
app.use("/api", attributeRouter);
app.use("/api", cartRouter);
app.use("/api", checkoutRouter);
app.use("/api/payment", paymentRouter);


connectDB();

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
export const viteNodeApp = app;
