import Ai_Assistant_Interction from "../models/AI_Assistant_Interaction.js";

// Change: getAllai_Assisstant_Interction → getAllAi_Assistant_Interctions
const getAllAi_Assistant_Interctions = async (req, res) => {
  try {
    const ai_Assisstant_Interction = await Ai_Assistant_Interction.find();

    res.status(200).json({
      success: true,
      count: ai_Assisstant_Interction.length,
      data: ai_Assisstant_Interction,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error ai_Assisstant_Interction ",
      error: error.message,
    });
  }
};

// Change: getitemById → getAi_Assistant_InterctionById
const getAi_Assistant_InterctionById = async (req, res) => {
  try {
    const ai_Assisstant_Interction = await Ai_Assistant_Interction.findById(
      req.params.id
    );

    if (!ai_Assisstant_Interction) {
      // Changed from !Ai_Assistant_Interction to !ai_Assisstant_Interction
      return res.status(404).json({
        success: false,
        error: "Ai_Assistant_Interction not found",
      });
    }

    res.json({
      success: true,
      data: Ai_Assistant_Interction,
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

// Change: createitem → createAi_Assistant_Interction
const createAi_Assistant_Interction = async (req, res) => {
  try {
    const newitem = new Ai_Assistant_Interction(req.body);
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

// Change: updateitem → updateAi_Assistant_Interction
const updateAi_Assistant_Interction = async (req, res) => {
  try {
    const ai_Assisstant_Interction =
      await Ai_Assistant_Interction.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

    if (!ai_Assisstant_Interction) {
      // Changed from !Ai_Assistant_Interction to !ai_Assisstant_Interction
      return res.status(404).json({
        success: false,
        error: "item not found",
      });
    }

    res.json({
      success: true,
      data: ai_Assisstant_Interction,
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

// Change: deleteitem → deleteAi_Assistant_Interction
const deleteAi_Assistant_Interction = async (req, res) => {
  try {
    const ai_Assisstant_Interction =
      await Ai_Assistant_Interction.findByIdAndDelete(req.params.id);

    if (!ai_Assisstant_Interction) {
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

export {
  getAllAi_Assistant_Interctions,
  getAi_Assistant_InterctionById,
  createAi_Assistant_Interction,
  updateAi_Assistant_Interction,
  deleteAi_Assistant_Interction,
};
