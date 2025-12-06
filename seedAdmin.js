import mongoose from "mongoose";
import User from "./models/User.js";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, ".env") });

const seedAdmin = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB Connected");

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: "admin@mr5school.com" });
        if (existingAdmin) {
            console.log("⚠️  Admin user already exists");
            process.exit(0);
        }

        // Create admin user
        const admin = await User.create({
            name: "Admin User",
            email: "admin@mr5school.com",
            password: "admin123", // Will be hashed by pre-save hook
            role: "admin",
            status: "approved",
            isActive: true,
        });

        console.log("✅ Admin user created successfully!");
        console.log("📧 Email: admin@mr5school.com");
        console.log("🔑 Password: admin123");
        console.log("\n⚠️  Please change the password after first login!");

        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding admin:", error);
        process.exit(1);
    }
};

seedAdmin();
