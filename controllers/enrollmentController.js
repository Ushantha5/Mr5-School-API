import Enrollment from "../models/Enrollment.js";

const getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate("student", "name email") // show name + email from User
      .populate("course", "title description") // show title + description
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: enrollments.length,
      data: enrollments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching enrollments",
      error: error.message,
    });
  }
};

// Change: getenrollmentById → getEnrollmentById
const getEnrollmentById = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id);

    if (!enrollment) {
      // Changed from !Enrollment to !enrollment
      return res.status(404).json({
        success: false,
        error: "Enrollment not found",
      });
    }

    res.json({
      success: true,
      data: Enrollment,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "Invalid enrollment ID format",
      });
    }

    res.status(500).json({
      success: false,
      error: "Failed to fetch enrollment",
    });
  }
};

// Change: createenrollment → createEnrollment
const createEnrollment = async (req, res) => {
  try {
    const newenrollment = new Enrollment(req.body);
    const savedenrollment = await newenrollment.save();

    res.status(201).json({
      success: true,
      data: savedenrollment,
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
      error: "Failed to create enrollment",
    });
  }
};

// Change: updateenrollment → updateEnrollment
const updateEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!enrollment) {
      // Changed from !Enrollment to !enrollment
      return res.status(404).json({
        success: false,
        error: "enrollment not found",
      });
    }

    res.json({
      success: true,
      data: enrollment,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "Invalid enrollment ID format",
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
      error: "Failed to update enrollment",
    });
  }
};

// Change: deleteenrollment → deleteEnrollment
const deleteEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findByIdAndDelete(req.params.id);

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        error: "enrollment not found",
      });
    }

    res.json({
      success: true,
      message: "enrollment deleted successfully",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "Invalid enrollment ID format",
      });
    }
    res.status(500).json({
      success: false,
      error: "Failed to delete enrollment",
    });
  }
};

export {
  getAllEnrollments,
  getEnrollmentById,
  createEnrollment,
  updateEnrollment,
  deleteEnrollment,
};
