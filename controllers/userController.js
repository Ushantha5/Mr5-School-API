import User from "../models/User.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { paginate } from "../utils/pagination.js";

// @desc    Get all users with pagination
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
	const { page, limit, role, search } = req.query;

	// Build query
	const query = {};
	if (role) query.role = role;
	if (search) {
		query.$or = [
			{ name: { $regex: search, $options: "i" } },
			{ email: { $regex: search, $options: "i" } },
		];
	}

	const result = await paginate(User, query, {
		page,
		limit,
		sort: "-createdAt",
	});

	res.status(200).json({
		success: true,
		...result,
	});
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
const getUserById = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.id);

	if (!user) {
		return res.status(404).json({
			success: false,
			error: "User not found",
		});
	}

	res.json({
		success: true,
		data: user,
	});
});

// @desc    Create user
// @route   POST /api/users
// @access  Private/Admin
const createUser = asyncHandler(async (req, res) => {
	const newuser = new User(req.body);
	const saveduser = await newuser.save();

	res.status(201).json({
		success: true,
		data: saveduser,
	});
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
const updateUser = asyncHandler(async (req, res) => {
	const user = await User.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	if (!user) {
		return res.status(404).json({
			success: false,
			error: "User not found",
		});
	}

	res.json({
		success: true,
		data: user,
	});
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
	const user = await User.findByIdAndDelete(req.params.id);

	if (!user) {
		return res.status(404).json({
			success: false,
			error: "User not found",
		});
	}

	res.json({
		success: true,
		message: "User deleted successfully",
	});
});

export { getAllUsers, getUserById, createUser, updateUser, deleteUser };
