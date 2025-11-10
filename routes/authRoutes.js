import express from "express";
import {
  register,
  login,
  getMe,
  updateDetails,
  updatePassword,
} from "../controllers/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", verifyToken, getMe);
router.put("/updatedetails", verifyToken, updateDetails);
router.put("/updatepassword", verifyToken, updatePassword);

export default router;

