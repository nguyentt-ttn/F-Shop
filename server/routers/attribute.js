import express from "express";
import {
    
    getAttributes,
    getAttributeById,
    updateAttribute,
    deleteAttribute,
    createOrUpdateAttribute,
} from "../controllers/attribute";

const attributeRouter = express.Router();

// attributeRouter.post("/attributes", createAttribute);
attributeRouter.post("/attributes", createOrUpdateAttribute);
attributeRouter.get("/attributes", getAttributes);
attributeRouter.get("/attributes/:id", getAttributeById);
attributeRouter.put("/attributes/:id", updateAttribute);
attributeRouter.delete("/attributes/:id", deleteAttribute);

export default attributeRouter;