# Thunder Client Authentication Guide

This guide will help you test the authentication API endpoints using Thunder Client (or any REST client like Postman).

## 📋 Table of Contents
- [Prerequisites](#prerequisites)
- [Base URL](#base-url)
- [Authentication Flow](#authentication-flow)
- [Endpoints](#endpoints)
  - [1. Register User](#1-register-user)
  - [2. Login User](#2-login-user)
  - [3. Get Current User](#3-get-current-user)
  - [4. Update User Details](#4-update-user-details)
  - [5. Update Password](#5-update-password)
  - [6. User Approval/Activation](#6-user-approvalactivation)
- [Using Environment Variables in Thunder Client](#using-environment-variables-in-thunder-client)
- [Common Errors and Solutions](#common-errors-and-solutions)

---

## Prerequisites

1. **Server is running**: Make sure your server is running on the configured port (default: 5000)
   ```bash
   cd Server
   npm run dev
   ```

2. **Thunder Client installed**: Install Thunder Client extension in VS Code
   - Open VS Code
   - Go to Extensions (Ctrl+Shift+X)
   - Search for "Thunder Client"
   - Install it

3. **Environment Variables**: Ensure your `.env` file has:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key_here_minimum_32_characters
   JWT_EXPIRE=30d
   NODE_ENV=development
   ```

---

## Base URL

```
http://localhost:5000/api
```

**Note**: Replace `localhost:5000` with your server address if different.

---

## Authentication Flow

1. **Register** a new user → Get a JWT token
2. **Login** with credentials → Get a JWT token
3. Use the token in the **Authorization header** for protected routes
4. **Admin** can approve/activate users by updating `isActive` field

---

## Endpoints

### 1. Register User

Create a new user account.

**Endpoint**: `POST /api/auth/register`

**Access**: Public (No token required)

**Request Headers**:
```
Content-Type: application/json
```

**Request Body** (JSON):
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "password123",
  "role": "student"
}
```

**Role Options**: `student`, `teacher`, `admin` (default: `student`)

**Thunder Client Setup**:
1. Method: `POST`
2. URL: `http://localhost:5000/api/auth/register`
3. Headers:
   - `Content-Type`: `application/json`
4. Body: Select `JSON` and paste the request body above

**Success Response** (201):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "role": "student"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response** (400):
```json
{
  "success": false,
  "error": "User already exists with this email"
}
```

**Important**: Save the `token` from the response - you'll need it for protected routes!

---

### 2. Login User

Login with existing credentials.

**Endpoint**: `POST /api/auth/login`

**Access**: Public (No token required)

**Request Headers**:
```
Content-Type: application/json
```

**Request Body** (JSON):
```json
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

**Thunder Client Setup**:
1. Method: `POST`
2. URL: `http://localhost:5000/api/auth/login`
3. Headers:
   - `Content-Type`: `application/json`
4. Body: Select `JSON` and paste the request body above

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "role": "student",
      "language": "English"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response** (401):
```json
{
  "success": false,
  "error": "Invalid credentials"
}
```

**Error Response** (401 - Account Deactivated):
```json
{
  "success": false,
  "error": "Your account has been deactivated"
}
```

**Important**: Save the `token` from the response for authenticated requests!

---

### 3. Get Current User

Get the currently logged-in user's information.

**Endpoint**: `GET /api/auth/me`

**Access**: Private (Token required)

**Request Headers**:
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Thunder Client Setup**:
1. Method: `GET`
2. URL: `http://localhost:5000/api/auth/me`
3. Headers:
   - `Authorization`: `Bearer YOUR_JWT_TOKEN` (replace with your actual token)
   - `Content-Type`: `application/json`

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "student",
    "language": "English",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Response** (401):
```json
{
  "success": false,
  "error": "Not authorized to access this route"
}
```

---

### 4. Update User Details

Update the current user's profile information.

**Endpoint**: `PUT /api/auth/updatedetails`

**Access**: Private (Token required)

**Request Headers**:
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request Body** (JSON) - All fields are optional:
```json
{
  "name": "John Smith",
  "email": "john.smith@example.com",
  "language": "Tamil",
  "profileImage": "https://example.com/profile.jpg"
}
```

**Language Options**: `English`, `Tamil`, `Sinhala`

**Thunder Client Setup**:
1. Method: `PUT`
2. URL: `http://localhost:5000/api/auth/updatedetails`
3. Headers:
   - `Authorization`: `Bearer YOUR_JWT_TOKEN`
   - `Content-Type`: `application/json`
4. Body: Select `JSON` and paste the request body (include only fields you want to update)

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Smith",
    "email": "john.smith@example.com",
    "role": "student",
    "language": "Tamil",
    "profileImage": "https://example.com/profile.jpg",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

---

### 5. Update Password

Change the current user's password.

**Endpoint**: `PUT /api/auth/updatepassword`

**Access**: Private (Token required)

**Request Headers**:
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request Body** (JSON):
```json
{
  "currentPassword": "password123",
  "newPassword": "newpassword456"
}
```

**Thunder Client Setup**:
1. Method: `PUT`
2. URL: `http://localhost:5000/api/auth/updatepassword`
3. Headers:
   - `Authorization`: `Bearer YOUR_JWT_TOKEN`
   - `Content-Type`: `application/json`
4. Body: Select `JSON` and paste the request body

**Success Response** (200):
```json
{
  "success": true,
  "message": "Password updated successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response** (401):
```json
{
  "success": false,
  "error": "Current password is incorrect"
}
```

**Note**: A new token is returned after password update. Use this new token for subsequent requests.

---

### 6. User Approval/Activation

Approve or activate/deactivate a user account. This is typically done by an admin.

**Endpoint**: `PUT /api/users/:id`

**Access**: Private (Token required)

**Request Headers**:
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**URL Parameters**:
- `id`: User ID to update

**Request Body** (JSON) - To activate a user:
```json
{
  "isActive": true
}
```

**Request Body** (JSON) - To deactivate a user:
```json
{
  "isActive": false
}
```

**Thunder Client Setup**:
1. Method: `PUT`
2. URL: `http://localhost:5000/api/users/USER_ID` (replace USER_ID with actual user ID)
3. Headers:
   - `Authorization`: `Bearer YOUR_ADMIN_JWT_TOKEN`
   - `Content-Type`: `application/json`
4. Body: Select `JSON` and paste the request body

**Example URL**: `http://localhost:5000/api/users/507f1f77bcf86cd799439011`

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "student",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

**Complete User Update Example** (Update multiple fields):
```json
{
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "role": "teacher",
  "language": "Sinhala",
  "isActive": true
}
```

**Note**: 
- Only admin users should perform user approval/activation
- Deactivated users (`isActive: false`) cannot login
- You can also update other user fields like `name`, `email`, `role`, `language` in the same request

---

## Using Environment Variables in Thunder Client

Thunder Client supports environment variables to make testing easier.

### Setting Up Environment Variables:

1. **Open Thunder Client** in VS Code
2. Click on the **Environment** icon (cloud icon) in the sidebar
3. Click **New Environment** or edit existing
4. Add variables:
   ```
   baseUrl = http://localhost:5000/api
   token = (leave empty, will be set after login)
   ```
5. Save the environment

### Using Variables in Requests:

1. **Base URL**: Use `{{baseUrl}}` instead of full URL
   - Example: `{{baseUrl}}/auth/login`

2. **Token**: After login, copy the token and set it in environment variables
   - In Authorization header: `Bearer {{token}}`

### Auto-save Token After Login:

1. After successful login, click on the response
2. Copy the token value
3. Go to Environment variables
4. Set `token` = `your_copied_token`
5. Now all requests using `{{token}}` will use this token automatically

---

## Complete Testing Workflow

### Step 1: Register a New User
```
POST http://localhost:5000/api/auth/register
Body: {
  "name": "Test User",
  "email": "test@example.com",
  "password": "test123",
  "role": "student"
}
```
**Save the token from response**

### Step 2: Login (Alternative to Register)
```
POST http://localhost:5000/api/auth/login
Body: {
  "email": "test@example.com",
  "password": "test123"
}
```
**Save the token from response**

### Step 3: Get Current User
```
GET http://localhost:5000/api/auth/me
Headers: Authorization: Bearer YOUR_TOKEN
```

### Step 4: Update User Details
```
PUT http://localhost:5000/api/auth/updatedetails
Headers: Authorization: Bearer YOUR_TOKEN
Body: {
  "name": "Updated Name",
  "language": "Tamil"
}
```

### Step 5: Register an Admin User (for approval testing)
```
POST http://localhost:5000/api/auth/register
Body: {
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "admin123",
  "role": "admin"
}
```
**Save the admin token**

### Step 6: Approve/Activate a User (as Admin)
```
PUT http://localhost:5000/api/users/USER_ID
Headers: Authorization: Bearer ADMIN_TOKEN
Body: {
  "isActive": true
}
```

### Step 7: Update Password
```
PUT http://localhost:5000/api/auth/updatepassword
Headers: Authorization: Bearer YOUR_TOKEN
Body: {
  "currentPassword": "test123",
  "newPassword": "newpassword123"
}
```
**Save the new token from response**

---

## Common Errors and Solutions

### 1. "MONGO_URI is not defined"
**Solution**: Check your `.env` file in the `Server` directory and ensure `MONGO_URI` is set.

### 2. "Not authorized to access this route"
**Solution**: 
- Make sure you're including the `Authorization` header
- Format: `Bearer YOUR_TOKEN` (with a space after "Bearer")
- Check if your token is expired (tokens expire after 30 days by default)

### 3. "Invalid credentials"
**Solution**: 
- Verify email and password are correct
- Check if the user exists
- Verify the user account is active (`isActive: true`)

### 4. "User already exists with this email"
**Solution**: Use a different email or login with existing credentials.

### 5. "User account is deactivated"
**Solution**: Admin needs to activate the user by setting `isActive: true`.

### 6. Connection refused / Cannot connect to server
**Solution**: 
- Make sure the server is running: `npm run dev` in the Server directory
- Check if the port (5000) is correct
- Verify the base URL in your requests

### 7. Token expired
**Solution**: Login again to get a new token, or update password to get a new token.

---

## Quick Reference

| Endpoint | Method | Auth Required | Description |
|----------|--------|---------------|-------------|
| `/api/auth/register` | POST | No | Register new user |
| `/api/auth/login` | POST | No | Login user |
| `/api/auth/me` | GET | Yes | Get current user |
| `/api/auth/updatedetails` | PUT | Yes | Update user details |
| `/api/auth/updatepassword` | PUT | Yes | Update password |
| `/api/users/:id` | PUT | Yes | Update user (approval/activation) |

---

## Tips for Testing

1. **Save Tokens**: Always save tokens after login/register for use in subsequent requests
2. **Use Environment Variables**: Set up Thunder Client environment variables for easier testing
3. **Test Error Cases**: Try invalid credentials, expired tokens, missing fields, etc.
4. **Check Response Status**: Verify HTTP status codes (200, 201, 400, 401, 403, 404)
5. **Test Different Roles**: Create users with different roles (student, teacher, admin) to test role-based access
6. **Verify Active Status**: Test login with `isActive: false` to see deactivated user error

---

## Support

If you encounter any issues:
1. Check server logs for detailed error messages
2. Verify your `.env` file configuration
3. Ensure MongoDB is running and accessible
4. Check that all dependencies are installed: `npm install`

---

**Happy Testing! 🚀**

