import mongoose from "mongoose";

const connectDB = async () => {
	try {
		// Support both MONGO_URI and MONGODB_URI environment variable names
		const uri = process.env.MONGO_URI || process.env.MONGODB_URI;
		if (!uri) {
			throw new Error(
				"MONGO_URI (or MONGODB_URI) is not defined in environment variables",
			);
		}

		// Connect to MongoDB
		await mongoose.connect(uri);

		console.log("MongoDB Connected Successfully");
		return mongoose.connection;
	} catch (error) {
		console.warn(`MongoDB Connection Error: ${error?.message || error}`);
		console.warn(
			"⚠️  WARNING: Running without database connection!",
		);
		console.warn(
			"Please make sure your .env has a correct MONGO_URI and the database is reachable.",
		);
		console.warn(
			"The server will continue running, but database operations will fail.",
		);
		// Don't exit - allow server to run for development
		// process.exit(1);
	}
};

export default connectDB;
export { connectDB as connectToDatabase };
