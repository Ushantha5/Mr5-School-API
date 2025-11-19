# Quick Start Guide - Course Seeding

## 🚀 Quick Setup

### Step 1: Install Gemini API Package (if not already installed)
```bash
cd Server
npm install @google/generative-ai
```

### Step 2: Set Up Environment Variables

Create/update `Server/.env` file:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
NODE_ENV=development

# Optional: For AI-generated course descriptions
GEMINI_API_KEY=your_gemini_api_key
```

**Get Gemini API Key**: Visit [Google AI Studio](https://makersuite.google.com/app/apikey) (optional - script works without it)

### Step 3: Run the Seed Script

```bash
cd Server
npm run seed:courses
```

This will:
- ✅ Create/update 31 courses with all details
- ✅ Generate AI-powered descriptions (if Gemini API key provided)
- ✅ Set proper categories, levels, and prices
- ✅ Auto-approve all courses

### Step 4: View Courses

1. **Start the server** (if not running):
   ```bash
   cd Server
   npm run dev
   ```

2. **Open the frontend**:
   - Open `public/courses.html` in your browser
   - Or visit: `http://localhost:5000/api/courses` for API response

##  Course List (31 Courses)

All courses will be created with the following prices (in Rupees):

| # | Course Title | Price (Rs) |
|---|-------------|------------|
| 1 | Full-Stack | 999 |
| 2 | Cybersecurity Fundamentals | 899 |
| 3 | UI/UX Design Masterclass | 999 |
| 4 | Ms Office | 299 |
| 5 | Network Security & Firewalls | 599 |
| 6 | ChatGPT & Prompt Engineering | 199 |
| 7 | Motion Graphics with After Effects | 799 |
| 8 | Logo Design Principles | 499 |
| 9 | Branding & Visual Identity | 699 |
| 10 | Resume Building & Interview Prep | 199 |
| 11 | Editing | 399 |
| 12 | Canva Design for Beginners | 299 |
| 13 | 3D Design with Blender | 599 |
| 14 | Animation Fundamentals | 499 |
| 15 | Typography & Color Theory | 799 |
| 16 | Portfolio Building for Designers | 299 |
| 17 | Machine Learning Fundamentals | 999 |
| 18 | Artificial Intelligence (Theory) | 899 |
| 19 | Time Management | 199 |
| 20 | Cloud DevOps Engineering | 699 |
| 21 | No-Code App Development | 699 |
| 22 | Automation with n8n & Zapier | 799 |
| 23 | Cyber Law & Privacy | 599 |
| 24 | Communication & Presentation Skills | 399 |
| 25 | LLM | 499 |
| 26 | Subscription 24/7/S | 9,999 |
| 27 | Subscription 24/30/C | 19,999 |
| 28 | Subscription 24/60/B | 39,999 |
| 29 | Subscription 24/90/VIP | 99,999 |
| 30 | Business Enterprise | 14,999 |
| 31 | Kids Learning | 499 |

## ✨ Features

- **AI-Powered Descriptions**: Uses Gemini API for detailed course descriptions
- **Smart Defaults**: Works even without Gemini API key
- **Auto-Categorization**: Automatically categorizes courses
- **Price Formatting**: Frontend displays prices in Rupees (Rs) format
- **Search & Filter**: Full search and filter functionality on frontend
- **Idempotent**: Safe to run multiple times

## 🔍 Testing

After seeding, test the API:
```bash
# Get all courses
curl http://localhost:5000/api/courses

# Filter by category
curl http://localhost:5000/api/courses?category=Design

# Search courses
curl http://localhost:5000/api/courses?search=Full-Stack
```

## 📝 Notes

- Default teacher/admin user will be created if none exists
- All courses are automatically approved
- Prices are stored in Rupees (Rs)
- Frontend displays prices with proper formatting (e.g., Rs9,999)

## 🆘 Troubleshooting

**MongoDB Connection Error**: Check `MONGO_URI` in `.env`
**Gemini API Error**: Script will use default descriptions (still works!)
**Course Not Showing**: Check if `isApproved=true` filter is applied

For detailed information, see `Server/COURSE_SEEDING_GUIDE.md`



