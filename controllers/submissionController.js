import Submission from "../models/Submission.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { paginate } from "../utils/pagination.js";

// @desc    Get all submissions with pagination
// @route   GET /api/submissions
// @access  Private
const getAllSubmissions = asyncHandler(async (req, res) => {
  const { page, limit, assignment, student, grade, search } = req.query;

  // Build query
  const query = {};
  if (assignment) query.assignment = assignment;
  if (student) query.student = student;
  if (grade) query.grade = grade;
  if (search) {
    query.$or = [
      { feedback: { $regex: search, $options: "i" } },
      { fileUrl: { $regex: search, $options: "i" } },
    ];
  }

  const result = await paginate(Submission, query, {
    page,
    limit,
    sort: "-createdAt",
    populate: [
      {
        path: "assignment",
        select: "title description dueDate",
        populate: {
          path: "course",
          select: "title",
        },
      },
      {
        path: "student",
        select: "name email profileImage",
      },
    ],
  });

  res.status(200).json({
    success: true,
    ...result,
  });
});

// @desc    Get submission by ID
// @route   GET /api/submissions/:id
// @access  Private
const getSubmissionById = asyncHandler(async (req, res) => {
  const submission = await Submission.findById(req.params.id)
    .populate({
      path: "assignment",
      select: "title description dueDate",
      populate: {
        path: "course",
        select: "title",
      },
    })
    .populate("student", "name email profileImage");

  if (!submission) {
    return res.status(404).json({
      success: false,
      error: "Submission not found",
    });
  }

  res.json({
    success: true,
    data: submission,
  });
});

// @desc    Create submission
// @route   POST /api/submissions
// @access  Private
const createSubmission = asyncHandler(async (req, res) => {
  const newsubmission = new Submission(req.body);
  const savedsubmission = await newsubmission.save();

  const populatedSubmission = await Submission.findById(
    savedsubmission._id
  )
    .populate({
      path: "assignment",
      select: "title description dueDate",
      populate: {
        path: "course",
        select: "title",
      },
    })
    .populate("student", "name email profileImage");

  res.status(201).json({
    success: true,
    data: populatedSubmission,
  });
});

// @desc    Update submission
// @route   PUT /api/submissions/:id
// @access  Private
const updateSubmission = asyncHandler(async (req, res) => {
  const submission = await Submission.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  )
    .populate({
      path: "assignment",
      select: "title description dueDate",
      populate: {
        path: "course",
        select: "title",
      },
    })
    .populate("student", "name email profileImage");

  if (!submission) {
    return res.status(404).json({
      success: false,
      error: "Submission not found",
    });
  }

  res.json({
    success: true,
    data: submission,
  });
});

// @desc    Delete submission
// @route   DELETE /api/submissions/:id
// @access  Private
const deleteSubmission = asyncHandler(async (req, res) => {
  const submission = await Submission.findByIdAndDelete(req.params.id);

  if (!submission) {
    return res.status(404).json({
      success: false,
      error: "Submission not found",
    });
  }

  res.json({
    success: true,
    message: "Submission deleted successfully",
  });
});

export {
  getAllSubmissions,
  getSubmissionById,
  createSubmission,
  updateSubmission,
  deleteSubmission,
};
