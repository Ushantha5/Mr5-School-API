import Payment from "../models/Payment.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { paginate } from "../utils/pagination.js";

// @desc    Get all payments with pagination
// @route   GET /api/payments
// @access  Private/Admin
const getAllPayments = asyncHandler(async (req, res) => {
  const { page, limit, user, course, status, method, search } = req.query;

  // Build query
  const query = {};
  if (user) query.user = user;
  if (course) query.course = course;
  if (status) query.status = status;
  if (method) query.method = method;
  if (search) {
    query.$or = [
      { transactionId: { $regex: search, $options: "i" } },
    ];
  }

  const result = await paginate(Payment, query, {
    page,
    limit,
    sort: "-createdAt",
    populate: [
      {
        path: "user",
        select: "name email profileImage",
      },
      {
        path: "course",
        select: "title description thumbnail price",
        populate: {
          path: "teacher",
          select: "name email",
        },
      },
    ],
  });

  res.status(200).json({
    success: true,
    ...result,
  });
});

// @desc    Get payment by ID
// @route   GET /api/payments/:id
// @access  Private
const getPaymentById = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id)
    .populate("user", "name email profileImage")
    .populate({
      path: "course",
      select: "title description thumbnail price teacher",
      populate: {
        path: "teacher",
        select: "name email",
      },
    });

  if (!payment) {
    return res.status(404).json({
      success: false,
      error: "Payment not found",
    });
  }

  res.json({
    success: true,
    data: payment,
  });
});

// @desc    Create payment
// @route   POST /api/payments
// @access  Private
const createPayment = asyncHandler(async (req, res) => {
  const newpayment = new Payment(req.body);
  const savedpayment = await newpayment.save();

  const populatedPayment = await Payment.findById(savedpayment._id)
    .populate("user", "name email profileImage")
    .populate({
      path: "course",
      select: "title description thumbnail price",
      populate: {
        path: "teacher",
        select: "name email",
      },
    });

  res.status(201).json({
    success: true,
    data: populatedPayment,
  });
});

// @desc    Update payment
// @route   PUT /api/payments/:id
// @access  Private/Admin
const updatePayment = asyncHandler(async (req, res) => {
  const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
    .populate("user", "name email profileImage")
    .populate({
      path: "course",
      select: "title description thumbnail price",
      populate: {
        path: "teacher",
        select: "name email",
      },
    });

  if (!payment) {
    return res.status(404).json({
      success: false,
      error: "Payment not found",
    });
  }

  res.json({
    success: true,
    data: payment,
  });
});

// @desc    Delete payment
// @route   DELETE /api/payments/:id
// @access  Private/Admin
const deletePayment = asyncHandler(async (req, res) => {
  const payment = await Payment.findByIdAndDelete(req.params.id);

  if (!payment) {
    return res.status(404).json({
      success: false,
      error: "Payment not found",
    });
  }

  res.json({
    success: true,
    message: "Payment deleted successfully",
  });
});

export {
  getAllPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment,
};
