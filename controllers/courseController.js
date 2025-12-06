import Course from "../models/Course.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { paginate } from "../utils/pagination.js";

// @desc    Get all courses with pagination
// @route   GET /api/courses
// @access  Public
const getAllCourses = asyncHandler(async (req, res) => {
	const { page, limit, teacher, level, language, search, isApproved } =
		req.query;

	// Build query
	const query = {};
	if (teacher) query.teacher = teacher;
	if (level) query.level = level;
	if (language) query.language = language;
	if (isApproved !== undefined) query.isApproved = isApproved === "true";
	if (search) {
		query.$or = [
			{ title: { $regex: search, $options: "i" } },
			{ description: { $regex: search, $options: "i" } },
			{ category: { $regex: search, $options: "i" } },
		];
	}

	const result = await paginate(Course, query, {
		page,
		limit,
		sort: "-createdAt",
		populate: [{ path: "teacher", select: "name email profileImage" }],
	});

	res.status(200).json({
		success: true,
		...result,
	});
});

// @desc    Get course by ID
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = asyncHandler(async (req, res) => {
	const course = await Course.findById(req.params.id).populate(
		"teacher",
		"name email profileImage",
	);

	if (!course) {
		return res.status(404).json({
			success: false,
			error: "Course not found",
		});
	}

	res.json({
		success: true,
		data: course,
	});
});

// @desc    Create course
// @route   POST /api/courses
// @access  Private/Teacher/Admin
const createCourse = asyncHandler(async (req, res) => {
	const newcourse = new Course(req.body);
	const savedcourse = await newcourse.save();

	const populatedCourse = await Course.findById(savedcourse._id).populate(
		"teacher",
		"name email profileImage",
	);

	res.status(201).json({
		success: true,
		data: populatedCourse,
	});
});

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private/Teacher/Admin
const updateCourse = asyncHandler(async (req, res) => {
	const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	}).populate("teacher", "name email profileImage");

	if (!course) {
		return res.status(404).json({
			success: false,
			error: "Course not found",
		});
	}

	res.json({
		success: true,
		data: course,
	});
});

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
const deleteCourse = asyncHandler(async (req, res) => {
	const course = await Course.findByIdAndDelete(req.params.id);

	if (!course) {
		return res.status(404).json({
			success: false,
			error: "Course not found",
		});
	}

	res.json({
		success: true,
		message: "Course deleted successfully",
	});
});

export {
	getAllCourses,
	getCourseById,
	createCourse,
	updateCourse,
	deleteCourse,
};
