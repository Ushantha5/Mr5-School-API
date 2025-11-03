// models/Lesson.js
import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    title: { type: String, required: true },
    videoUrl: String,
    content: String,
    duration: Number, // in minutes
    order: Number, // for sorting lessons
  },
  { timestamps: true }
);

export default mongoose.model("Lesson", lessonSchema);
