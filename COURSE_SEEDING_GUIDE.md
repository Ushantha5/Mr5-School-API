# Course Seeding Guide

This guide explains how to seed the database with 31 courses using the Gemini API for generating course descriptions.

## Prerequisites

1. **MongoDB Database**: Ensure your MongoDB is running and accessible
2. **Environment Variables**: Set up your `.env` file in the `Server` directory
3. **Gemini API Key** (Optional but recommended): Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

## Setup Instructions

### 1. Install Dependencies

The Gemini API package is already installed. If you need to reinstall:

```bash
cd Server
npm install @google/generative-ai
```

### 2. Configure Environment Variables

Create or update your `.env` file in the `Server` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key_here_minimum_32_characters
JWT_EXPIRE=30d
NODE_ENV=development

# Gemini API Key (Optional - will use default descriptions if not provided)
GEMINI_API_KEY=your_gemini_api_key_here
```

**Note**: If you don't provide a `GEMINI_API_KEY`, the script will use intelligent default descriptions based on course titles.

### 3. Run the Seed Script

From the `Server` directory, run:

```bash
npm run seed:courses
```

Or directly:

```bash
node scripts/seedCourses.js
```

## What the Script Does

1. **Connects to Database**: Establishes connection to MongoDB
2. **Creates/Find Teacher**: Creates a default admin user if none exists, or uses an existing teacher/admin
3. **Generates Course Details**: For each course:
   - Uses Gemini API to generate comprehensive descriptions (if API key is provided)
   - Categorizes courses automatically
   - Determines appropriate difficulty level
   - Sets prices from the predefined list
4. **Creates/Updates Courses**: 
   - Creates new courses if they don't exist
   - Updates existing courses with new descriptions
   - Sets all courses as approved

## Course List

The script will create/update 31 courses:

1. Full-Stack - Rs999
2. Cybersecurity Fundamentals - Rs899
3. UI/UX Design Masterclass - Rs999
4. Ms Office - Rs299
5. Network Security & Firewalls - Rs599
6. ChatGPT & Prompt Engineering - Rs199
7. Motion Graphics with After Effects - Rs799
8. Logo Design Principles - Rs499
9. Branding & Visual Identity - Rs699
10. Resume Building & Interview Prep - Rs199
11. Editing - Rs399
12. Canva Design for Beginners - Rs299
13. 3D Design with Blender - Rs599
14. Animation Fundamentals - Rs499
15. Typography & Color Theory - Rs799
16. Portfolio Building for Designers - Rs299
17. Machine Learning Fundamentals - Rs999
18. Artificial Intelligence (Theory) - Rs899
19. Time Management - Rs199
20. Cloud DevOps Engineering - Rs699
21. No-Code App Development - Rs699
22. Automation with n8n & Zapier - Rs799
23. Cyber Law & Privacy - Rs599
24. Communication & Presentation Skills - Rs399
25. LLM - Rs499
26. Subscription 24/7/S - Rs9,999
27. Subscription 24/30/C - Rs19,999
28. Subscription 24/60/B - Rs39,999
29. Subscription 24/90/VIP ff/first priority New features - Rs99,999
30. Business Enterprise - Rs14,999
31. Kids Learning - Rs499

## Features

- ✅ **Intelligent Descriptions**: Uses Gemini AI to generate detailed, engaging course descriptions
- ✅ **Auto-Categorization**: Automatically categorizes courses (Technology, Design, Security, etc.)
- ✅ **Level Detection**: Determines appropriate difficulty level (Beginner, Intermediate, Advanced)
- ✅ **Fallback System**: Uses smart defaults if Gemini API is unavailable
- ✅ **Idempotent**: Can be run multiple times safely (updates existing courses)
- ✅ **Error Handling**: Continues processing even if individual courses fail

## Troubleshooting

### MongoDB Connection Error
- Verify `MONGO_URI` is correct in `.env`
- Ensure MongoDB is running
- Check network connectivity

### Gemini API Errors
- If API key is invalid, the script will use default descriptions
- Check API key format and permissions
- Verify internet connection for API calls

### Course Creation Errors
- Check database permissions
- Ensure teacher/admin user exists or can be created
- Review error messages in console output

## Viewing Courses

After seeding, you can view courses:
- **Frontend**: Open `public/courses.html` in your browser
- **API**: `GET http://localhost:5000/api/courses`
- **Filtered**: Use query parameters like `?level=Beginner&category=Design`

## Notes

- The script includes a 1-second delay between API calls to avoid rate limiting
- All courses are automatically set as `isApproved: true`
- Default teacher email: `admin@courses.com` (password: `Admin@123`)
- Prices are stored in Rupees (Rs) format



