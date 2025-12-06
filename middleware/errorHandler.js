// Centralized Error Handler Middleware
export const errorHandler = (err, req, res, next) => {
	let error = { ...err };
	error.message = err.message;

	// Log error for debugging
	console.error(err);

	// Mongoose bad ObjectId
	if (err.name === "CastError") {
		const message = "Resource not found";
		error = { message, statusCode: 404 };
	}

	// Mongoose duplicate key
	if (err.code === 11000) {
		const field = Object.keys(err.keyPattern)[0];
		const message = `${field} already exists`;
		error = { message, statusCode: 400 };
	}

	// Mongoose validation error
	if (err.name === "ValidationError") {
		const errors = Object.values(err.errors).map((e) => ({
			field: e.path,
			message: e.message,
		}));
		const message = "Validation Error";
		error = { message, statusCode: 400, errors };
	}

	// JWT errors
	if (err.name === "JsonWebTokenError") {
		const message = "Invalid token";
		error = { message, statusCode: 401 };
	}

	if (err.name === "TokenExpiredError") {
		const message = "Token expired";
		error = { message, statusCode: 401 };
	}

	res.status(error.statusCode || 500).json({
		success: false,
		error: error.message || "Server Error",
		...(error.errors && { details: error.errors }),
		...(process.env.NODE_ENV === "development" && { stack: err.stack }),
	});
};

// Async handler wrapper to catch errors
export const asyncHandler = (fn) => (req, res, next) => {
	Promise.resolve(fn(req, res, next)).catch(next);
};
