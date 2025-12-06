import express from "express";
import {
	getPendingRegistrations,
	approveRegistration,
	rejectRegistration,
} from "../controllers/adminController.js";
import { verifyToken, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protect all routes
router.use(verifyToken);
router.use(authorize("admin"));

router.get("/registrations/pending", getPendingRegistrations);
router.post("/registrations/:id/approve", approveRegistration);
router.post("/registrations/:id/reject", rejectRegistration);

export default router;
