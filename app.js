import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import connectDB from "./config/db.js";
import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import submissionRoutes from "./routes/submissionRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import lessonRoutes from "./routes/lessonRoutes.js";
import enrollmentRoutes from "./routes/enrollmentRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";
import ai_Assistant_InteractionRoutes from "./routes/ai_Assistant_InteractionRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import avathorRoutes from "./routes/avathorRoutes.js";
import livekitRoutes from "./routes/livekitRoutes.js";
import ttsRoutes from "./routes/ttsRoutes.js";
import course from "./routes/courseRoutes.js"

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file in the Server directory
dotenv.config({ path: join(__dirname, ".env") });

const app = express();

// Configure CORS - allow multiple origins for development and production
const allowedOrigins = [
    "http://localhost:3000",
    "https://mr5-school-api.vercel.app",
    process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(null, true); // Allow all origins for public API
        }
    },
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/aI_Assistant_Interaction", ai_Assistant_InteractionRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/avathor", avathorRoutes);
app.use("/api/livekit", livekitRoutes);
app.use("/api/tts", ttsRoutes);

// Error handler (must be last)
app.use(errorHandler);

// Start server with database connection
const PORT = process.env.PORT || 5000;

// Async function to start the server
(async () => {
    try {
        // Connect to database before starting server
        await connectDB();

        // Start the server only after DB is connected
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
})();
