import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			unique: true,
			required: true,
			lowercase: true,
		},
		password: {
			type: String,
			required: true,
			minlength: 6,
			select: false,
		},
		role: {
			type: String,
			enum: ["student", "teacher", "admin"],
			default: "student",
		},
		status: {
			type: String,
			enum: ["pending", "approved", "rejected"],
			default: "approved", // Students auto-approved by default, Teachers pending
		},
		profileImage: String,
		avatarUrl: {
			type: String,
			default: "",
		},
		// References to profile tables
		studentProfile: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "StudentProfile",
		},
		teacherProfile: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "TeacherProfile",
		},
		language: {
			type: String,
			enum: ["English", "Tamil", "Sinhala"],
			default: "English",
		},
		isActive: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: true },
);

// Password hash middleware
userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();
	this.password = await bcrypt.hash(this.password, 10);
	next();
});

export default mongoose.model("User", userSchema);
