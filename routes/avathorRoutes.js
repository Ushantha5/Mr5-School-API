import express from "express";
import User from "../models/User.js";
import Teacher from "../models/Teacher.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

/**
 * @route   POST /api/avathor/auto-register
 * @desc    Automatically register and approve Avathor AI teachers
 * @access  Public (but with special token validation)
 */
router.post("/auto-register", async (req, res) => {
	try {
		const { name, email, password, phone, specialization, bio, avathorToken } =
			req.body;

		// Validate Avathor AI token (special authentication for AI teachers)
		const AVATHOR_SECRET_TOKEN =
			process.env.AVATHOR_SECRET_TOKEN || "avathor-ai-secret-2025";
		if (avathorToken !== AVATHOR_SECRET_TOKEN) {
			return res.status(403).json({
				success: false,
				message: "Invalid Avathor AI authentication token",
			});
		}

		// Check if user already exists
		let user = await User.findOne({ email });
		if (user) {
			return res.status(400).json({
				success: false,
				message: "User with this email already exists",
			});
		}

		// Hash password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		// Create user with teacher role and APPROVED status
		user = new User({
			name,
			email,
			password: hashedPassword,
			phone,
			role: "teacher",
			status: "approved", // Auto-approve Avathor AI teachers
		});

		await user.save();

		// Create teacher profile
		const teacher = new Teacher({
			user: user._id,
			specialization: specialization || "AI & Programming",
			bio: bio || "AI-powered teaching assistant from Avathor AI",
			isAvathorAI: true, // Mark as Avathor AI teacher
			approvedAt: new Date(),
			approvedBy: "system", // System-approved
		});

		await teacher.save();

		// Generate JWT token
		const payload = {
			user: {
				id: user._id,
				role: user.role,
				status: user.status,
			},
		};

		const token = jwt.sign(payload, process.env.JWT_SECRET, {
			expiresIn: process.env.JWT_EXPIRES_IN || "7d",
		});

		res.json({
			success: true,
			message: "Avathor AI teacher registered and approved successfully",
			data: {
				user: {
					id: user._id,
					name: user.name,
					email: user.email,
					role: user.role,
					status: user.status,
				},
				teacher: {
					id: teacher._id,
					specialization: teacher.specialization,
					isAvathorAI: teacher.isAvathorAI,
				},
				token,
			},
		});
	} catch (error) {
		console.error("Avathor AI auto-registration error:", error);
		res.status(500).json({
			success: false,
			message: "Server error during Avathor AI registration",
			error: error.message,
		});
	}
});

/**
 * @route   GET /api/avathor/teachers
 * @desc    Get all Avathor AI teachers
 * @access  Public
 */
router.get("/teachers", async (req, res) => {
	try {
		const avathorTeachers = await Teacher.find({ isAvathorAI: true })
			.populate("user", "name email status")
			.select("specialization bio approvedAt");

		res.json({
			success: true,
			data: avathorTeachers,
		});
	} catch (error) {
		console.error("Error fetching Avathor AI teachers:", error);
		res.status(500).json({
			success: false,
			message: "Server error",
			error: error.message,
		});
	}
});

export default router;
