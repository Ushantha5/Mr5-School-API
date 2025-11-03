import express from "express";
import {
  getAllEnrollments,
  getEnrollmentById,
  createEnrollment,
  updateEnrollment,
  deleteEnrollment,
} from "../controllers/itemController.js";
const router = express.Router();
router.get("/", getAllEnrollments);
router.get("/:id", getEnrollmentById);
router.post("/", createEnrollment);
router.put("/:id", updateEnrollment);
router.delete("/:id", deleteEnrollment);

export default router;
