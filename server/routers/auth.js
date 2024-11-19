import { Router } from "express";
import {
    signin,
    signup,
    requestPasswordReset,
    resetPassword,
    getCurrentUser,
    
} from "../controllers/auth";
import { authMiddleware } from "../middlewares/auth";

const authRouter = Router();

authRouter.post(`/signup`, signup);
authRouter.post(`/signin`, signin);
authRouter.post(`/request-password-reset`, requestPasswordReset);
authRouter.post(`/reset-password`, resetPassword);
authRouter.get(`/current-user`, authMiddleware, getCurrentUser);

export default authRouter;