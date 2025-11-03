import Enrollment from "../models/Enrollment.js";

// Change: getAllenrollment → getAllEnrollments
export const getAllEnrollments = async (req, res) => {
  try {
    const enrollment = await Enrollment.find();

    res.status(200).json({
      success: true,
      count: enrollment.length,
      data: enrollment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error enrollment ",
      error: error.message,
    });
  }
};

// Change: getitemById → getEnrollmentById
export const getEnrollmentById = async (req, res) => {
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
        error: "Invalid item ID format",
      });
    }

    res.status(500).json({
      success: false,
      error: "Failed to fetch item",
    });
  }
};

// Change: createitem → createEnrollment
export const createEnrollment = async (req, res) => {
  try {
    const newitem = new Enrollment(req.body);
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

// Change: updateitem → updateEnrollment
export const updateEnrollment = async (req, res) => {
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
        error: "item not found",
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

// Change: deleteitem → deleteEnrollment
export const deleteEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findByIdAndDelete(req.params.id);

    if (!enrollment) {
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
