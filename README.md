# Learning Management System API

Enterprise-grade REST API for a Learning Management System built with Node.js, Express, and MongoDB.

## 🚀 Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control (Student, Teacher, Admin)
- **Security**: Helmet, rate limiting, CORS, input sanitization, XSS protection
- **Validation**: Comprehensive input validation using express-validator
- **Error Handling**: Centralized error handling with proper HTTP status codes
- **Logging**: Winston-based logging system with file and console outputs
- **Database**: MongoDB with Mongoose ODM, optimized with indexes
- **API Features**:
  - User management
  - Course management
  - Enrollment system
  - Lesson management
  - Assignment & submission tracking
  - Payment processing
  - AI Assistant interactions

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (v5 or higher)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   cd Server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the `Server` directory:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key_min_32_chars
   JWT_EXPIRE=30d
   LOG_LEVEL=info
   CORS_ORIGIN=*
   GEMINI_API_KEY=your_gemini_api_key_optional
   ```

4. **Create logs directory**
   ```bash
   mkdir logs
   ```

5. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)
- `PUT /api/auth/updatedetails` - Update user details (Protected)
- `PUT /api/auth/updatepassword` - Update password (Protected)

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID (Protected)
- `POST /api/users` - Create user (Admin only)
- `PUT /api/users/:id` - Update user (Protected - own profile or admin)
- `DELETE /api/users/:id` - Delete user (Admin only)

### Courses
- `GET /api/courses` - Get all courses (Public)
- `GET /api/courses/:id` - Get course by ID (Public)
- `POST /api/courses` - Create course (Teacher/Admin)
- `PUT /api/courses/:id` - Update course (Teacher/Admin - owner or admin)
- `DELETE /api/courses/:id` - Delete course (Admin only)

### Enrollments
- `GET /api/enrollments` - Get all enrollments (Protected)
- `GET /api/enrollments/:id` - Get enrollment by ID (Protected)
- `POST /api/enrollments` - Create enrollment (Protected)
- `PUT /api/enrollments/:id` - Update enrollment (Protected - owner or admin)
- `DELETE /api/enrollments/:id` - Delete enrollment (Protected - owner or admin)

### Lessons
- `GET /api/lessons` - Get all lessons (Protected)
- `GET /api/lessons/:id` - Get lesson by ID (Protected)
- `POST /api/lessons` - Create lesson (Teacher/Admin)
- `PUT /api/lessons/:id` - Update lesson (Teacher/Admin - course owner or admin)
- `DELETE /api/lessons/:id` - Delete lesson (Teacher/Admin - course owner or admin)

### Assignments
- `GET /api/assignments` - Get all assignments (Protected)
- `GET /api/assignments/:id` - Get assignment by ID (Protected)
- `POST /api/assignments` - Create assignment (Teacher/Admin)
- `PUT /api/assignments/:id` - Update assignment (Teacher/Admin - owner or admin)
- `DELETE /api/assignments/:id` - Delete assignment (Teacher/Admin - owner or admin)

### Submissions
- `GET /api/submissions` - Get all submissions (Protected)
- `GET /api/submissions/:id` - Get submission by ID (Protected)
- `POST /api/submissions` - Create submission (Protected)
- `PUT /api/submissions/:id` - Update submission (Protected - owner can update file, teacher can grade)
- `DELETE /api/submissions/:id` - Delete submission (Protected)

### Payments
- `GET /api/payments` - Get all payments (Protected - own payments or admin)
- `GET /api/payments/:id` - Get payment by ID (Protected)
- `POST /api/payments` - Create payment (Protected)
- `PUT /api/payments/:id` - Update payment (Admin only)
- `DELETE /api/payments/:id` - Delete payment (Admin only)

### AI Assistant Interactions
- `GET /api/aI_Assistant_Interctions` - Get all interactions (Protected - own interactions or admin)
- `GET /api/aI_Assistant_Interctions/:id` - Get interaction by ID (Protected)
- `POST /api/aI_Assistant_Interctions` - Create interaction (Protected)
- `PUT /api/aI_Assistant_Interctions/:id` - Update interaction (Protected)
- `DELETE /api/aI_Assistant_Interctions/:id` - Delete interaction (Protected)

### Health Check
- `GET /health` - Server health check
- `GET /api` - API information

## 🔒 Security Features

- **Helmet**: Security headers
- **Rate Limiting**: 
  - General API: 100 requests per 15 minutes
  - Auth endpoints: 5 requests per 15 minutes
- **CORS**: Configurable CORS policy
- **Input Sanitization**: MongoDB injection and XSS protection
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Role-Based Access Control**: Student, Teacher, Admin roles

## 📝 Request/Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "details": [ ... ] // Optional validation errors
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 10,
    "totalItems": 100,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

## 🔑 Authentication

Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## 📊 Database Indexes

The following indexes are automatically created for optimal performance:
- User: email, role, isActive
- Course: teacher, isApproved, category, level, text search
- Enrollment: student+course (unique), student+status, course+status
- Lesson: course+order, course+createdAt
- Assignment: course, teacher, dueDate
- Submission: assignment+student (unique), student+grade, assignment+grade
- Payment: user+status, course+status, transactionId
- AI Interaction: user+createdAt, course+createdAt

## 🐛 Error Handling

All errors are handled centrally with appropriate HTTP status codes:
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource not found)
- `500` - Internal Server Error

## 📝 Logging

Logs are written to:
- Console (development)
- `logs/combined.log` - All logs
- `logs/error.log` - Error logs only
- `logs/exceptions.log` - Uncaught exceptions
- `logs/rejections.log` - Unhandled promise rejections

## 🚀 Production Deployment

1. Set `NODE_ENV=production`
2. Use a strong `JWT_SECRET` (minimum 32 characters)
3. Configure proper `CORS_ORIGIN`
4. Set up MongoDB connection pooling
5. Use a process manager like PM2
6. Set up reverse proxy (nginx)
7. Enable HTTPS
8. Monitor logs regularly

## 📄 License

ISC

## 👥 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 🆘 Support

For issues and questions, please open an issue in the repository.






