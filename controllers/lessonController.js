import Lesson from "../models/Lesson.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { paginate } from "../utils/pagination.js";

// @desc    Get all lessons with pagination
// @route   GET /api/lessons
// @access  Private
const getAllLessons = asyncHandler(async (req, res) => {
	const { page, limit, course, search } = req.query;

	// Build query
	const query = {};
	if (course) query.course = course;
	if (search) {
		query.$or = [
			{ title: { $regex: search, $options: "i" } },
			{ content: { $regex: search, $options: "i" } },
		];
	}

	const result = await paginate(Lesson, query, {
		page,
		limit,
		sort: "order createdAt",
		populate: [
			{
				path: "course",
				select: "title description thumbnail level teacher",
				populate: {
					path: "teacher",
					select: "name email",
				},
			},
		],
	});

	res.status(200).json({
		success: true,
		...result,
	});
});

// @desc    Get lesson by ID
// @route   GET /api/lessons/:id
// @access  Private
const getLessonById = asyncHandler(async (req, res) => {
	const lesson = await Lesson.findById(req.params.id).populate({
		path: "course",
		select: "title description thumbnail level teacher",
		populate: {
			path: "teacher",
			select: "name email profileImage",
		},
	});

	if (!lesson) {
		return res.status(404).json({
			success: false,
			error: "Lesson not found",
		});
	}

	res.json({
		success: true,
		data: lesson,
	});
});

// @desc    Create lesson
// @route   POST /api/lessons
// @access  Private/Teacher/Admin
const createLesson = asyncHandler(async (req, res) => {
	const newlesson = new Lesson(req.body);
	const savedlesson = await newlesson.save();

	const populatedLesson = await Lesson.findById(savedlesson._id).populate({
		path: "course",
		select: "title description thumbnail level teacher",
		populate: {
			path: "teacher",
			select: "name email",
		},
	});

	res.status(201).json({
		success: true,
		data: populatedLesson,
	});
});

// @desc    Update lesson
// @route   PUT /api/lessons/:id
// @access  Private/Teacher/Admin
const updateLesson = asyncHandler(async (req, res) => {
	const lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	}).populate({
		path: "course",
		select: "title description thumbnail level teacher",
		populate: {
			path: "teacher",
			select: "name email",
		},
	});

	if (!lesson) {
		return res.status(404).json({
			success: false,
			error: "Lesson not found",
		});
	}

	res.json({
		success: true,
		data: lesson,
	});
});

// @desc    Delete lesson
// @route   DELETE /api/lessons/:id
// @access  Private/Teacher/Admin
const deleteLesson = asyncHandler(async (req, res) => {
	const lesson = await Lesson.findByIdAndDelete(req.params.id);

	if (!lesson) {
		return res.status(404).json({
			success: false,
			error: "Lesson not found",
		});
	}

	res.json({
		success: true,
		message: "Lesson deleted successfully",
	});
});

export {
	getAllLessons,
	getLessonById,
	createLesson,
	updateLesson,
	deleteLesson,
};
