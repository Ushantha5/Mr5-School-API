import express from "express";
import {
  getAllAi_Assistant_Interctions,
  getAi_Assistant_InterctionById,
  createAi_Assistant_Interction,
  updateAi_Assistant_Interction,
  deleteAi_Assistant_Interction,
} from "../controllers/itemController.js";
const router = express.Router();
router.get("/", getAllAi_Assistant_Interctions);
router.get("/:id", getAi_Assistant_InterctionById);
router.post("/", createAi_Assistant_Interction);
router.put("/:id", updateAi_Assistant_Interction);
router.delete("/:id", deleteAi_Assistant_Interction);

export default router;
