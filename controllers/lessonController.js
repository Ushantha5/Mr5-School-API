import Lesson from "../models/Lesson.js";

// Change: getAlllesson → getAllLessons
const getAllLessons = async (req, res) => {
  try {
    const lesson = await Lesson.find();

    res.status(200).json({
      success: true,
      count: lesson.length,
      data: lesson,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error lesson ",
      error: error.message,
    });
  }
};

// Change: getlessonById → getLessonById
const getLessonById = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);

    if (!lesson) {
      // Changed from !Lesson to !lesson
      return res.status(404).json({
        success: false,
        error: "Lesson not found",
      });
    }

    res.json({
      success: true,
      data: Lesson,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "Invalid lesson ID format",
      });
    }

    res.status(500).json({
      success: false,
      error: "Failed to fetch lesson",
    });
  }
};

// Change: createlesson → createLesson
const createLesson = async (req, res) => {
  try {
    const newlesson = new Lesson(req.body);
    const savedlesson = await newlesson.save();

    res.status(201).json({
      success: true,
      data: savedlesson,
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
      error: "Failed to create lesson",
    });
  }
};

// Change: updatelesson → updateLesson
const updateLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!lesson) {
      // Changed from !Lesson to !lesson
      return res.status(404).json({
        success: false,
        error: "lesson not found",
      });
    }

    res.json({
      success: true,
      data: lesson,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "Invalid lesson ID format",
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
      error: "Failed to update lesson",
    });
  }
};

// Change: deletelesson → deleteLesson
const deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndDelete(req.params.id);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        error: "lesson not found",
      });
    }

    res.json({
      success: true,
      message: "lesson deleted successfully",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "Invalid lesson ID format",
      });
    }
    res.status(500).json({
      success: false,
      error: "Failed to delete lesson",
    });
  }
};

export {
  getAllLessons,
  getLessonById,
  createLesson,
  updateLesson,
  deleteLesson,
};
