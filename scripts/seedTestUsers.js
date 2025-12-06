import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import User from "../models/User.js";
import Student from "../models/Student.js";
import Teacher from "../models/Teacher.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, "..", ".env") });

const testUsers = [
	{
		name: "Admin User",
		email: "admin@mr5school.com",
		password: "admin123",
		role: "admin",
		status: "active",
	},
	{
		name: "Test Student",
		email: "student@test.com",
		password: "student123",
		role: "student",
		status: "active",
	},
	{
		name: "Test Teacher",
		email: "teacher@test.com",
		password: "teacher123",
		role: "teacher",
		status: "active",
	},
	{
		name: "Test Customer",
		email: "customer@test.com",
		password: "customer123",
		role: "customer",
		status: "active",
	},
];

async function seedTestUsers() {
	try {
		await mongoose.connect(process.env.MONGO_URI);
		console.log("MongoDB Connected for seeding...");

		// Clear existing test users
		await User.deleteMany({ email: { $in: testUsers.map((u) => u.email) } });
		console.log("Cleared existing test users");

		// Create test users
		for (const userData of testUsers) {
			const hashedPassword = await bcrypt.hash(userData.password, 10);

			const user = await User.create({
				...userData,
				password: hashedPassword,
			});

			console.log(`✅ Created ${userData.role}: ${userData.email}`);

			// Create profile for student
			if (userData.role === "student") {
				await Student.create({
					userId: user._id,
					grade: "10th",
					enrolledCourses: [],
				});
				console.log(`   → Created student profile`);
			}

			// Create profile for teacher
			if (userData.role === "teacher") {
				await Teacher.create({
					userId: user._id,
					bio: "Experienced educator with passion for teaching",
					qualifications: "M.Ed in Computer Science",
					experience: "5 years",
					approvedBy: user._id, // Self-approved for testing
					approvedAt: new Date(),
				});
				console.log(`   → Created teacher profile (pre-approved)`);
			}
		}

		console.log("\n🎉 All test users created successfully!");
		console.log("\n📋 Test Credentials:");
		console.log("━".repeat(50));
		testUsers.forEach((u) => {
			console.log(
				`${u.role.toUpperCase().padEnd(10)} | ${u.email.padEnd(25)} | ${
					u.password
				}`,
			);
		});
		console.log("━".repeat(50));

		process.exit(0);
	} catch (error) {
		console.error("Error seeding test users:", error);
		process.exit(1);
	}
}

seedTestUsers();
