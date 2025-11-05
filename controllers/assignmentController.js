const getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate("course", "title description")
      .populate("student", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: assignments.length,
      data: assignments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching assignments",
      error: error.message,
    });
  }
};

// Change: getassignmentById → getAssignmentById
const getAssignmentById = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      // Changed from !Assignment to !assignment
      return res.status(404).json({
        success: false,
        error: "Assignment not found",
      });
    }

    res.json({
      success: true,
      data: Assignment,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "Invalid assignment ID format",
      });
    }

    res.status(500).json({
      success: false,
      error: "Failed to fetch assignment",
    });
  }
};

// Change: createassignment → createAssignment
const createAssignment = async (req, res) => {
  try {
    const newassignment = new Assignment(req.body);
    const savedassignment = await newassignment.save();

    res.status(201).json({
      success: true,
      data: savedassignment,
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
      error: "Failed to create assignment",
    });
  }
};

// Change: updateassignment → updateAssignment
const updateAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!assignment) {
      // Changed from !Assignment to !assignment
      return res.status(404).json({
        success: false,
        error: "assignment not found",
      });
    }

    res.json({
      success: true,
      data: assignment,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "Invalid assignment ID format",
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
      error: "Failed to update assignment",
    });
  }
};

// Change: deleteassignment → deleteAssignment
const deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndDelete(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        error: "assignment not found",
      });
    }

    res.json({
      success: true,
      message: "assignment deleted successfully",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "Invalid assignment ID format",
      });
    }
    res.status(500).json({
      success: false,
      error: "Failed to delete assignment",
    });
  }
};

export {
  getAllAssignments,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment,
};
