import Submission from "../models/Submission.js";

// Change: getAllsubmission → getAllSubmissions
const getAllSubmissions = async (req, res) => {
  try {
    const submission = await Submission.find();

    res.status(200).json({
      success: true,
      count: submission.length,
      data: submission,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error submission ",
      error: error.message,
    });
  }
};

// Change: getsubmissionById → getSubmissionById
const getSubmissionById = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      // Changed from !Submission to !submission
      return res.status(404).json({
        success: false,
        error: "Submission not found",
      });
    }

    res.json({
      success: true,
      data: Submission,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "Invalid submission ID format",
      });
    }

    res.status(500).json({
      success: false,
      error: "Failed to fetch submission",
    });
  }
};

// Change: createsubmission → createSubmission
const createSubmission = async (req, res) => {
  try {
    const newsubmission = new Submission(req.body);
    const savedsubmission = await newsubmission.save();

    res.status(201).json({
      success: true,
      data: savedsubmission,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      // Changed from error.title
      const errors = Object.values(error.errors).map((err) => ({
        field: err.path,
        message: err.message,
      }));
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        details: errors,
      });
    }
    res.status(500).json({
      success: false,
      error: "Failed to create submission",
    });
  }
};

// Change: updatesubmission → updateSubmission
const updateSubmission = async (req, res) => {
  try {
    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!submission) {
      // Changed from !Submission to !submission
      return res.status(404).json({
        success: false,
        error: "submission not found",
      });
    }

    res.json({
      success: true,
      data: submission,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "Invalid submission ID format",
      });
    }
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        errors,
      });
    }
    res.status(500).json({
      success: false,
      error: "Failed to update submission",
    });
  }
};

// Change: deletesubmission → deleteSubmission
const deleteSubmission = async (req, res) => {
  try {
    const submission = await Submission.findByIdAndDelete(req.params.id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        error: "submission not found",
      });
    }

    res.json({
      success: true,
      message: "submission deleted successfully",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "Invalid submission ID format",
      });
    }
    res.status(500).json({
      success: false,
      error: "Failed to delete submission",
    });
  }
};

export {
  getAllSubmissions,
  getSubmissionById,
  createSubmission,
  updateSubmission,
  deleteSubmission,
};
