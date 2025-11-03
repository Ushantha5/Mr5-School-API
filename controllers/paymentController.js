import Payment from "../models/Payment.js";

// Change: getAllpayment → getAllPayments
export const getAllPayments = async (req, res) => {
  try {
    const payment = await Payment.find();

    res.status(200).json({
      success: true,
      count: payment.length,
      data: payment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error payment ",
      error: error.message,
    });
  }
};

// Change: getitemById → getPaymentById
export const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      // Changed from !Payment to !payment
      return res.status(404).json({
        success: false,
        error: "Payment not found",
      });
    }

    res.json({
      success: true,
      data: Payment,
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

// Change: createitem → createPayment
export const createPayment = async (req, res) => {
  try {
    const newitem = new Payment(req.body);
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

// Change: updateitem → updatePayment
export const updatePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!payment) {
      // Changed from !Payment to !payment
      return res.status(404).json({
        success: false,
        error: "item not found",
      });
    }

    res.json({
      success: true,
      data: payment,
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

// Change: deleteitem → deletePayment
export const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);

    if (!payment) {
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
