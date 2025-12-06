import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import User from "../models/User.js";
import Teacher from "../models/Teacher.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "..", ".env") });

async function createAvathorAI() {
	try {
		if (!process.env.MONGO_URI) {
			throw new Error("MONGO_URI not set in Server/.env");
		}

		await mongoose.connect(process.env.MONGO_URI);
		console.log("MongoDB connected for Avathor AI creation");

		const email = "avathor@ai.mr5school";
		const existing = await User.findOne({ email });
		if (existing) {
			console.log("Avathor AI user already exists:", email);
			process.exit(0);
		}

		const password = "AvathorAI#2025";
		const salt = await bcrypt.genSalt(10);
		const hashed = await bcrypt.hash(password, salt);

		const user = await User.create({
			name: "Avathor AI",
			email,
			password: hashed,
			role: "teacher",
			status: "approved",
		});

		const teacher = await Teacher.create({
			user: user._id,
			specialization: "AI Teaching Assistant",
			bio: "Avathor AI automated teacher",
			isAvathorAI: true,
			approvedAt: new Date(),
			approvedBy: "system",
		});

		console.log("✅ Created Avathor AI user and teacher:");
		console.log("   email:", email);
		console.log("   password:", password);
		console.log("   userId:", user._id.toString());
		console.log("   teacherId:", teacher._id.toString());

		process.exit(0);
	} catch (err) {
		console.error("Error creating Avathor AI:", err);
		process.exit(1);
	}
}

createAvathorAI();
