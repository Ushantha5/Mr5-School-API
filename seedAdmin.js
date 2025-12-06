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
        let admin = await User.findOne({ email: "admin@mr5school.com" });

        if (admin) {
            console.log("⚠️  Admin user already exists. Updating password...");
            admin.password = "Admin@123456";
            await admin.save();
            console.log("✅ Admin password updated.");
        } else {
            // Create admin user
            admin = await User.create({
                name: "Admin User",
                email: "admin@mr5school.com",
                password: "Admin@123456", // Will be hashed by pre-save hook
                role: "admin",
                status: "approved",
                isActive: true,
            });
            console.log("✅ Admin user created successfully!");
        }

        console.log("📧 Email: admin@mr5school.com");
        console.log("🔑 Password: Admin@123456");
        console.log("\n⚠️  Please change the password after first login!");

        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding admin:", error);
        process.exit(1);
    }
};

seedAdmin();
