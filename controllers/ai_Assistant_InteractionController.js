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

// Change: getai_Assistant_InteractionById → getAi_Assistant_InterctionById
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
        error: "Invalid ai_Assistant_Interaction ID format",
      });
    }

    res.status(500).json({
      success: false,
      error: "Failed to fetch ai_Assistant_Interaction",
    });
  }
};

// Change: createai_Assistant_Interaction → createAi_Assistant_Interction
const createAi_Assistant_Interction = async (req, res) => {
  try {
    const newai_Assistant_Interaction = new Ai_Assistant_Interction(req.body);
    const savedai_Assistant_Interaction =
      await newai_Assistant_Interaction.save();

    res.status(201).json({
      success: true,
      data: savedai_Assistant_Interaction,
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
      error: "Failed to create ai_Assistant_Interaction",
    });
  }
};

// Change: updateai_Assistant_Interaction → updateAi_Assistant_Interction
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
        error: "ai_Assistant_Interaction not found",
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
        error: "Invalid ai_Assistant_Interaction ID format",
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
      error: "Failed to update ai_Assistant_Interaction",
    });
  }
};

// Change: deleteai_Assistant_Interaction → deleteAi_Assistant_Interction
const deleteAi_Assistant_Interction = async (req, res) => {
  try {
    const ai_Assisstant_Interction =
      await Ai_Assistant_Interction.findByIdAndDelete(req.params.id);

    if (!ai_Assisstant_Interction) {
      return res.status(404).json({
        success: false,
        error: "ai_Assistant_Interaction not found",
      });
    }

    res.json({
      success: true,
      message: "ai_Assistant_Interaction deleted successfully",
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        error: "Invalid ai_Assistant_Interaction ID format",
      });
    }
    res.status(500).json({
      success: false,
      error: "Failed to delete ai_Assistant_Interaction",
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
