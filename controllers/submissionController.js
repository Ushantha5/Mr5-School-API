import Submission from "../models/Submission.js";

// Change: getAllsubmission → getAllSubmissions
export const getAllSubmissions = async (req, res) => {
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

// Change: getitemById → getSubmissionById
export const getSubmissionById = async (req, res) => {
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
        error: "Invalid item ID format",
      });
    }

    res.status(500).json({
      success: false,
      error: "Failed to fetch item",
    });
  }
};

// Change: createitem → createSubmission
export const createSubmission = async (req, res) => {
  try {
    const newitem = new Submission(req.body);
    const saveditem = await newitem.save();

    res.status(201).json({
      success: true,
      data: saveditem,
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
      error: "Failed to create item",
    });
  }
};

// Change: updateitem → updateSubmission
export const updateSubmission = async (req, res) => {
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
        error: "item not found",
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
        error: "Invalid item ID format",
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
      error: "Failed to update item",
    });
  }
};

// Change: deleteitem → deleteSubmission
export const deleteSubmission = async (req, res) => {
  try {
    const submission = await Submission.findByIdAndDelete(req.params.id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        error: "item not found",
      });
    }

    res.json({
      success: true,
      message: "item deleted successfully",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "Invalid item ID format",
      });
    }
    res.status(500).json({
      success: false,
      error: "Failed to delete item",
    });
  }
};
