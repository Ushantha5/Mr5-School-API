import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import logger from "./logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, "../.env") });

// Required environment variables
const requiredEnvVars = ["MONGO_URI", "JWT_SECRET", "PORT", "NODE_ENV"];

// Optional environment variables with defaults
const envConfig = {
	PORT: process.env.PORT || 5000,
	NODE_ENV: process.env.NODE_ENV || "development",
	MONGO_URI: process.env.MONGO_URI,
	JWT_SECRET: process.env.JWT_SECRET,
	JWT_EXPIRE: process.env.JWT_EXPIRE || "30d",
	LOG_LEVEL: process.env.LOG_LEVEL || "info",
	CORS_ORIGIN: process.env.CORS_ORIGIN || "*",
	GEMINI_API_KEY: process.env.GEMINI_API_KEY || "",
};

// Validate required environment variables
const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
	logger.error(
		`Missing required environment variables: ${missingVars.join(", ")}`,
	);
	process.exit(1);
}

// Validate NODE_ENV
if (!["development", "production", "test"].includes(envConfig.NODE_ENV)) {
	logger.error(
		`Invalid NODE_ENV: ${envConfig.NODE_ENV}. Must be development, production, or test`,
	);
	process.exit(1);
}

// Validate JWT_SECRET strength in production
if (
	envConfig.NODE_ENV === "production" &&
	envConfig.JWT_SECRET &&
	envConfig.JWT_SECRET.length < 32
) {
	logger.warn(
		"JWT_SECRET is less than 32 characters. Consider using a stronger secret in production.",
	);
}

logger.info("Environment variables validated successfully");

export default envConfig;
