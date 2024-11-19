import { Router } from "express";
import { createCategory, deleteCategory, getAllCategory, getOneCategory, updateCategory } from "../controllers/category";


const categoryRouter = Router()
categoryRouter.post('/category',createCategory)
categoryRouter.get('/category',getAllCategory)
categoryRouter.get('/category/:id',getOneCategory)
categoryRouter.put("/category/:id", updateCategory);
categoryRouter.delete("/category/:id", deleteCategory);

export default categoryRouter