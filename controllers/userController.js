import User from "../models/User.js";

// Change: getAlluser → getAllUsers
const getAllUsers = async (req, res) => {
  try {
    const user = await User.find();

    res.status(200).json({
      success: true,
      count: user.length,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error user ",
      error: error.message,
    });
  }
};

// Change: getuserById → getUserById
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      // Changed from !User to !user
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.json({
      success: true,
      data: User,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "Invalid user ID format",
      });
    }

    res.status(500).json({
      success: false,
      error: "Failed to fetch user",
    });
  }
};

// Change: createuser → createUser
const createUser = async (req, res) => {
  try {
    const newuser = new User(req.body);
    const saveduser = await newuser.save();

    res.status(201).json({
      success: true,
      data: saveduser,
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
      error: "Failed to create user",
    });
  }
};

// Change: updateuser → updateUser
const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      // Changed from !User to !user
      return res.status(404).json({
        success: false,
        error: "user not found",
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "Invalid user ID format",
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
      error: "Failed to update user",
    });
  }
};

// Change: deleteuser → deleteUser
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "user not found",
      });
    }

    res.json({
      success: true,
      message: "user deleted successfully",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "Invalid user ID format",
      });
    }
    res.status(500).json({
      success: false,
      error: "Failed to delete user",
    });
  }
};

export { getAllUsers, getUserById, createUser, updateUser, deleteUser };
