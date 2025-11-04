import Course from "../models/Course.js";

// Change: getAllcours → getAllCourses
const getAllCourses = async (req, res) => {
  try {
    const cours = await Course.find();

    res.status(200).json({
      success: true,
      count: cours.length,
      data: cours,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error cours ",
      error: error.message,
    });
  }
};

// Change: getcourseById → getCourseById
const getCourseById = async (req, res) => {
  try {
    const cours = await Course.findById(req.params.id);

    if (!cours) {
      // Changed from !Course to !cours
      return res.status(404).json({
        success: false,
        error: "Course not found",
      });
    }

    res.json({
      success: true,
      data: Course,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "Invalid course ID format",
      });
    }

    res.status(500).json({
      success: false,
      error: "Failed to fetch course",
    });
  }
};

// Change: createcourse → createCourse
const createCourse = async (req, res) => {
  try {
    const newcourse = new Course(req.body);
    const savedcourse = await newcourse.save();

    res.status(201).json({
      success: true,
      data: savedcourse,
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
      error: "Failed to create course",
    });
  }
};

// Change: updatecourse → updateCourse
const updateCourse = async (req, res) => {
  try {
    const cours = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!cours) {
      // Changed from !Course to !cours
      return res.status(404).json({
        success: false,
        error: "course not found",
      });
    }

    res.json({
      success: true,
      data: cours,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "Invalid course ID format",
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
      error: "Failed to update course",
    });
  }
};

// Change: deletecourse → deleteCourse
const deleteCourse = async (req, res) => {
  try {
    const cours = await Course.findByIdAndDelete(req.params.id);

    if (!cours) {
      return res.status(404).json({
        success: false,
        error: "course not found",
      });
    }

    res.json({
      success: true,
      message: "course deleted successfully",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "Invalid course ID format",
      });
    }
    res.status(500).json({
      success: false,
      error: "Failed to delete course",
    });
  }
};

export {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
};
