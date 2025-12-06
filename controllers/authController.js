import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../middleware/errorHandler.js";
import { registerSchema, loginSchema } from "../utils/validation.js";

// Generate JWT Token
const generateToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRE || "30d",
	});
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req, res) => {
	// Validate input
	const validation = registerSchema.safeParse(req.body);
	if (!validation.success) {
		return res.status(400).json({
			success: false,
			error: validation.error.errors[0].message,
		});
	}

	const { name, email, password, role, phone } = validation.data;

	// Check if user exists
	const userExists = await User.findOne({ email });
	if (userExists) {
		return res.status(400).json({
			success: false,
			error: "User already exists with this email",
		});
	}

	// Determine status based on role
	let status = "approved";
	if (role === "teacher") {
		status = "pending";
	}

	// Create user
	const user = await User.create({
		name,
		email,
		password,
		role: role || "student",
		status,
		// phone is not in schema yet, but can be added if needed or stored in profile
	});

	// Generate token
	const token = generateToken(user._id);

	// Set cookie
	const options = {
		expires: new Date(
			Date.now() +
				(parseInt(process.env.JWT_COOKIE_EXPIRE) || 30) * 24 * 60 * 60 * 1000,
		),
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
	};

	res
		.status(201)
		.cookie("access_token", token, options)
		.json({
			success: true,
			data: {
				user: {
					id: user._id,
					name: user.name,
					email: user.email,
					role: user.role,
					status: user.status,
				},
				token, // Return token as well for flexibility
			},
		});
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
	// Validate input
	const validation = loginSchema.safeParse(req.body);
	if (!validation.success) {
		return res.status(400).json({
			success: false,
			error: validation.error.errors[0].message,
		});
	}

	const { email, password } = validation.data;

	// Check for user
	const user = await User.findOne({ email }).select("+password");

	if (!user) {
		return res.status(401).json({
			success: false,
			error: "Invalid credentials",
		});
	}

	// Check if user is active
	if (!user.isActive) {
		return res.status(401).json({
			success: false,
			error: "Your account has been deactivated",
		});
	}

	// Check password
	const isMatch = await bcrypt.compare(password, user.password);

	if (!isMatch) {
		return res.status(401).json({
			success: false,
			error: "Invalid credentials",
		});
	}

	// Generate token
	const token = generateToken(user._id);

	// Set cookie
	const options = {
		expires: new Date(
			Date.now() +
				(parseInt(process.env.JWT_COOKIE_EXPIRE) || 30) * 24 * 60 * 60 * 1000,
		),
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
	};

	res
		.status(200)
		.cookie("access_token", token, options)
		.json({
			success: true,
			data: {
				user: {
					id: user._id,
					name: user.name,
					email: user.email,
					role: user.role,
					language: user.language,
					status: user.status,
				},
				token,
			},
		});
});

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
export const logout = asyncHandler(async (req, res) => {
	res.cookie("access_token", "none", {
		expires: new Date(Date.now() + 10 * 1000),
		httpOnly: true,
	});

	res.status(200).json({
		success: true,
		data: {},
	});
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user.id);

	res.status(200).json({
		success: true,
		data: user,
	});
});

// @desc    Update user details
// @route   PUT /api/auth/updatedetails
// @access  Private
export const updateDetails = asyncHandler(async (req, res) => {
	const fieldsToUpdate = {
		name: req.body.name,
		email: req.body.email,
		language: req.body.language,
		profileImage: req.body.profileImage,
		avatarUrl: req.body.avatarUrl,
	};

	const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
		new: true,
		runValidators: true,
	});

	res.status(200).json({
		success: true,
		data: user,
	});
});

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
export const updatePassword = asyncHandler(async (req, res) => {
	const { currentPassword, newPassword } = req.body;

	if (!currentPassword || !newPassword) {
		return res.status(400).json({
			success: false,
			error: "Please provide current password and new password",
		});
	}

	const user = await User.findById(req.user.id).select("+password");

	// Check current password
	const isMatch = await bcrypt.compare(currentPassword, user.password);

	if (!isMatch) {
		return res.status(401).json({
			success: false,
			error: "Current password is incorrect",
		});
	}

	// Hash new password
	const salt = await bcrypt.genSalt(10);
	user.password = await bcrypt.hash(newPassword, salt);
	await user.save();

	const token = generateToken(user._id);

	// Set cookie
	const options = {
		expires: new Date(
			Date.now() +
				(parseInt(process.env.JWT_COOKIE_EXPIRE) || 30) * 24 * 60 * 60 * 1000,
		),
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
	};

	res.status(200).cookie("access_token", token, options).json({
		success: true,
		message: "Password updated successfully",
		token,
	});
});
