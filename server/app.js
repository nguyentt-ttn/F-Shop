import express from 'express'
import cors  from 'cors';
import { connectDB } from './config/db';
import authRouter from './routers/auth';
import categoryRouter from './routers/category';
import morgan from 'morgan';
import 'dotenv/config';
import attributeRouter from './routers/attribute';
import productRouter from './routers/product';
import cartRouter from './routers/cart';
import checkoutRouter from './routers/checkout';
const app = express()
app.use(cors({
    origin: '*',          // Cho phép tất cả các origin
    credentials: true,    // Cho phép gửi cookie và thông tin xác thực
    methods: ['*']        // Cho phép tất cả các phương thức HTTP
}));
app.use(morgan("dev"))
app.use(express.json())

//routers
app.use("/api",productRouter)
app.use("/api",authRouter)
app.use("/api",categoryRouter)
app.use("/api",attributeRouter)
app.use("/api",cartRouter)
app.use("/api", checkoutRouter)


connectDB()
export const viteNodeApp = app;