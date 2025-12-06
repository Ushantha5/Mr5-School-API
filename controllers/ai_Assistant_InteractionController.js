import Ai_Assistant_Interction from "../models/AI_Assistant_Interaction.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { paginate } from "../utils/pagination.js";

// @desc    Get all AI assistant interactions with pagination
// @route   GET /api/aI_Assistant_Interctions
// @access  Private
const getAllAi_Assistant_Interctions = asyncHandler(async (req, res) => {
	const { page, limit, user, course, mode, search } = req.query;

	// Build query
	const query = {};
	if (user) query.user = user;
	if (course) query.course = course;
	if (mode) query.mode = mode;
	if (search) {
		query.$or = [
			{ question: { $regex: search, $options: "i" } },
			{ response: { $regex: search, $options: "i" } },
		];
	}

	const result = await paginate(Ai_Assistant_Interction, query, {
		page,
		limit,
		sort: "-createdAt",
		populate: [
			{
				path: "user",
				select: "name email profileImage",
			},
			{
				path: "course",
				select: "title description",
			},
		],
	});

	res.status(200).json({
		success: true,
		...result,
	});
});

// @desc    Get AI assistant interaction by ID
// @route   GET /api/aI_Assistant_Interctions/:id
// @access  Private
const getAi_Assistant_InterctionById = asyncHandler(async (req, res) => {
	const ai_Assistant_Interaction = await Ai_Assistant_Interction.findById(
		req.params.id,
	)
		.populate("user", "name email profileImage")
		.populate("course", "title description");

	if (!ai_Assistant_Interaction) {
		return res.status(404).json({
			success: false,
			error: "AI Assistant Interaction not found",
		});
	}

	res.json({
		success: true,
		data: ai_Assistant_Interaction,
	});
});

// @desc    Create AI assistant interaction
// @route   POST /api/aI_Assistant_Interctions
// @access  Private
const createAi_Assistant_Interction = asyncHandler(async (req, res) => {
	const newai_Assistant_Interaction = new Ai_Assistant_Interction(req.body);
	const savedai_Assistant_Interaction =
		await newai_Assistant_Interaction.save();

	const populatedInteraction = await Ai_Assistant_Interction.findById(
		savedai_Assistant_Interaction._id,
	)
		.populate("user", "name email profileImage")
		.populate("course", "title description");

	res.status(201).json({
		success: true,
		data: populatedInteraction,
	});
});

// @desc    Update AI assistant interaction
// @route   PUT /api/aI_Assistant_Interctions/:id
// @access  Private
const updateAi_Assistant_Interction = asyncHandler(async (req, res) => {
	const ai_Assistant_Interaction =
		await Ai_Assistant_Interction.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		})
			.populate("user", "name email profileImage")
			.populate("course", "title description");

	if (!ai_Assistant_Interaction) {
		return res.status(404).json({
			success: false,
			error: "AI Assistant Interaction not found",
		});
	}

	res.json({
		success: true,
		data: ai_Assistant_Interaction,
	});
});

// @desc    Delete AI assistant interaction
// @route   DELETE /api/aI_Assistant_Interctions/:id
// @access  Private
const deleteAi_Assistant_Interction = asyncHandler(async (req, res) => {
	const ai_Assistant_Interaction =
		await Ai_Assistant_Interction.findByIdAndDelete(req.params.id);

	if (!ai_Assistant_Interaction) {
		return res.status(404).json({
			success: false,
			error: "AI Assistant Interaction not found",
		});
	}

	res.json({
		success: true,
		message: "AI Assistant Interaction deleted successfully",
	});
});

export {
	getAllAi_Assistant_Interctions,
	getAi_Assistant_InterctionById,
	createAi_Assistant_Interction,
	updateAi_Assistant_Interction,
	deleteAi_Assistant_Interction,
};
