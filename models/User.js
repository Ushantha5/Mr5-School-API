// models/User.js
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
      select: false, // Don't return password by default
    },
    role: {
      type: String,
      enum: ["student", "teacher", "admin"],
      default: "student",
    },
    profileImage: String,
    avatarUrl: {
      type: String,
      default: "", // URL to the GLB file from ReadyPlayer.me
    },
    emotions: [
      {
        emotion: String,
        confidence: Number,
        timestamp: { type: Date, default: Date.now },
      },
    ],
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
  { timestamps: true }
);

// Password hash middleware (only if password is modified)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export default mongoose.model("User", userSchema);
