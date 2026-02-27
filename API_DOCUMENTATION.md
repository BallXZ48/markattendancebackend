# Student Attendance Check System - API Documentation

## Overview
This is a RESTful API backend for a **Student Attendance Check System** built with NestJS, MongoDB (Mongoose), and JWT authentication. The system manages university students, courses, and attendance records with role-based access control.

## Technologies
- **Framework:** NestJS 11
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (Access Token + Refresh Token)
- **Validation:** class-validator & class-transformer
- **Password Hashing:** Argon2
- **Rate Limiting:** Throttler

## User Roles
1. **Admin** - Full access to all features, manage users and courses
2. **Teacher** - Can create courses, record attendance, view reports
3. **Student** - Can view their own courses and attendance records

---

## Database Collections (3+ Collections)

### 1. User Collection
Stores user information with role-based access control.

**Fields:**
- `_id`: ObjectId (auto-generated)
- `email`: string (unique, lowercase)
- `fullName`: string
- `passwordHash`: string (not selected by default)
- `role`: enum ('admin', 'teacher', 'student')
- `studentId`: string (optional, for students)
- `department`: string (optional)
- `isActive`: boolean (default: true)
- `refreshTokenHash`: string (not selected by default)
- `createdAt`: Date
- `updatedAt`: Date

### 2. Course Collection
Stores course/subject information with teacher and student assignments.

**Fields:**
- `_id`: ObjectId
- `courseCode`: string (unique)
- `courseName`: string
- `description`: string
- `teacherId`: ObjectId (ref: User)
- `department`: string
- `semester`: number
- `academicYear`: number
- `studentIds`: [ObjectId] (ref: User array)
- `totalClasses`: number
- `credits`: number
- `isActive`: boolean (default: true)
- `createdAt`: Date
- `updatedAt`: Date

### 3. Attendance Collection
Records student attendance for each class session.

**Fields:**
- `_id`: ObjectId
- `courseId`: ObjectId (ref: Course)
- `studentId`: ObjectId (ref: User)
- `classDate`: Date
- `status`: enum ('present', 'absent', 'late', 'excused')
- `remarks`: string (optional)
- `recordedBy`: ObjectId (ref: User - teacher/admin who recorded)
- `sessionNumber`: number (optional)
- `createdAt`: Date
- `updatedAt`: Date
- **Unique Index:** courseId + studentId + classDate

---

## Authentication Endpoints

### Sign Up (Register)
```
POST /auth/signup
Content-Type: application/json

{
  "email": "student@maejo.ac.th",
  "password": "securePassword123",
  "fullName": "John Doe"
}

Response (200):
{
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc..."
}
```

### Sign In (Login)
```
POST /auth/signin
Content-Type: application/json

{
  "email": "student@maejo.ac.th",
  "password": "securePassword123"
}

Response (200):
{
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc..."
}
```

### Refresh Token
```
POST /auth/refresh
Headers: Authorization: Bearer {refresh_token}

Response (200):
{
  "access_token": "eyJhbGc...",
  "refresh_token": "eyJhbGc..."
}
```

### Logout
```
POST /auth/logout
Headers: Authorization: Bearer {access_token}

Response (200):
{
  "success": true
}
```

---

## Users Endpoints (Admin Only)

### Create User
```
POST /users
Headers: Authorization: Bearer {access_token}
Content-Type: application/json

{
  "email": "teacher@maejo.ac.th",
  "password": "securePassword123",
  "fullName": "Jane Smith",
  "role": "teacher",
  "department": "Computer Science"
}

Response (201):
{
  "_id": "507f1f77bcf86cd799439015",
  "email": "teacher@maejo.ac.th",
  "fullName": "Jane Smith",
  "role": "teacher",
  "department": "Computer Science",
  "isActive": true,
  "createdAt": "2026-02-20T10:00:00.000Z"
}
```

### Get All Users
```
GET /users
GET /users?role=teacher
GET /users?role=student
Headers: Authorization: Bearer {access_token}

Response (200):
[
  {
    "_id": "507f1f77bcf86cd799439015",
    "email": "teacher@maejo.ac.th",
    "fullName": "Jane Smith",
    "role": "teacher",
    "department": "Computer Science",
    "isActive": true
  }
]
```

### Get All Teachers
```
GET /users/teachers
Headers: Authorization: Bearer {access_token}
```

### Get All Students
```
GET /users/students
Headers: Authorization: Bearer {access_token}
```

### Get User by ID
```
GET /users/:id
Headers: Authorization: Bearer {access_token}

Response (200):
{
  "_id": "507f1f77bcf86cd799439015",
  "email": "student@maejo.ac.th",
  "fullName": "John Doe",
  "role": "student",
  "studentId": "6410001",
  "isActive": true
}
```

### Update User
```
PUT /users/:id
Headers: Authorization: Bearer {access_token}
Content-Type: application/json

{
  "fullName": "John Updated",
  "department": "Business"
}
```

### Assign Role to User
```
PUT /users/:id/role
Headers: Authorization: Bearer {access_token}
Content-Type: application/json

{
  "role": "teacher"
}
```

### Delete User
```
DELETE /users/:id
Headers: Authorization: Bearer {access_token}

Response (200):
{
  "success": true
}
```

---

## Courses Endpoints

### Create Course (Admin, Teacher)
```
POST /courses
Headers: Authorization: Bearer {access_token}
Content-Type: application/json

{
  "courseCode": "CS101",
  "courseName": "Introduction to Programming",
  "description": "Basic programming concepts",
  "teacherId": "507f1f77bcf86cd799439015",
  "department": "Computer Science",
  "semester": 1,
  "academicYear": 2566,
  "totalClasses": 15,
  "credits": 3
}

Response (201):
{
  "_id": "507f1f77bcf86cd799439016",
  "courseCode": "CS101",
  "courseName": "Introduction to Programming",
  "teacherId": { ... teacher object ... },
  "department": "Computer Science",
  "semester": 1,
  "academicYear": 2566,
  "studentIds": [],
  "totalClasses": 15,
  "credits": 3,
  "isActive": true
}
```

### Get All Courses
```
GET /courses
GET /courses?academicYear=2566
GET /courses?semester=1
GET /courses?teacherId=507f1f77bcf86cd799439015
Headers: Authorization: Bearer {access_token}

Response (200):
[ ... array of courses ... ]
```

### Get Course by ID
```
GET /courses/:courseId
Headers: Authorization: Bearer {access_token}

Response (200):
{
  "_id": "507f1f77bcf86cd799439016",
  "courseCode": "CS101",
  "courseName": "Introduction to Programming",
  "teacherId": { ... teacher object ... },
  "studentIds": [ ... array of student objects ... ],
  ...
}
```

### Get Teacher's Courses
```
GET /courses/teacher/:teacherId
Headers: Authorization: Bearer {access_token}
```

### Get Student's Courses
```
GET /courses/student/:studentId
Headers: Authorization: Bearer {access_token}
```

### Update Course
```
PUT /courses/:courseId
Headers: Authorization: Bearer {access_token}
Content-Type: application/json

{
  "courseName": "Introduction to Advanced Programming",
  "totalClasses": 16
}
```

### Add Students to Course
```
POST /courses/:courseId/students/add
Headers: Authorization: Bearer {access_token}
Content-Type: application/json

{
  "studentIds": ["507f1f77bcf86cd799439017", "507f1f77bcf86cd799439018"]
}

Response (200):
{
  "_id": "507f1f77bcf86cd799439016",
  "studentIds": [ ... updated array ... ]
}
```

### Remove Students from Course
```
POST /courses/:courseId/students/remove
Headers: Authorization: Bearer {access_token}
Content-Type: application/json

{
  "studentIds": ["507f1f77bcf86cd799439017"]
}
```

### Delete Course (Admin Only)
```
DELETE /courses/:courseId
Headers: Authorization: Bearer {access_token}

Response (200):
{
  "success": true
}
```

---

## Attendance Endpoints

### Record Attendance (Teacher, Admin)
```
POST /attendance
Headers: Authorization: Bearer {access_token}
Content-Type: application/json

{
  "courseId": "507f1f77bcf86cd799439016",
  "studentId": "507f1f77bcf86cd799439017",
  "classDate": "2026-02-20T10:00:00.000Z",
  "status": "present",
  "remarks": "On time",
  "sessionNumber": 1
}

Response (201):
{
  "_id": "507f1f77bcf86cd799439019",
  "courseId": "507f1f77bcf86cd799439016",
  "studentId": "507f1f77bcf86cd799439017",
  "classDate": "2026-02-20T10:00:00.000Z",
  "status": "present",
  "remarks": "On time",
  "recordedBy": "507f1f77bcf86cd799439015",
  "sessionNumber": 1
}
```

### Record Bulk Attendance
```
POST /attendance/bulk
Headers: Authorization: Bearer {access_token}
Content-Type: application/json

{
  "courseId": "507f1f77bcf86cd799439016",
  "classDate": "2026-02-20T10:00:00.000Z",
  "attendanceRecords": [
    {
      "studentId": "507f1f77bcf86cd799439017",
      "status": "present",
      "remarks": "On time"
    },
    {
      "studentId": "507f1f77bcf86cd799439018",
      "status": "absent"
    }
  ]
}

Response (201):
[ ... array of created attendance records ... ]
```

### Get Attendance by Course
```
GET /attendance/course/:courseId
Headers: Authorization: Bearer {access_token}

Response (200):
[
  {
    "_id": "507f1f77bcf86cd799439019",
    "studentId": { ... student object ... },
    "classDate": "2026-02-20T10:00:00.000Z",
    "status": "present",
    "recordedBy": { ... teacher object ... }
  }
]
```

### Get Attendance by Student
```
GET /attendance/student/:studentId
Headers: Authorization: Bearer {access_token}
```

### Get Attendance by Student and Course
```
GET /attendance/student/:studentId/course/:courseId
Headers: Authorization: Bearer {access_token}
```

### Get Student Attendance Statistics
```
GET /attendance/stats/student/:studentId/course/:courseId
Headers: Authorization: Bearer {access_token}

Response (200):
{
  "studentId": "507f1f77bcf86cd799439017",
  "courseId": "507f1f77bcf86cd799439016",
  "totalClasses": 15,
  "statusCounts": {
    "present": 12,
    "absent": 2,
    "late": 1,
    "excused": 0
  },
  "presentPercentage": "80.00"
}
```

### Get Attendance Report
```
GET /attendance/report?courseId=507f1f77bcf86cd799439016
GET /attendance/report?courseId=507f1f77bcf86cd799439016&studentId=507f1f77bcf86cd799439017
GET /attendance/report?courseId=507f1f77bcf86cd799439016&startDate=2026-02-01&endDate=2026-02-28
Headers: Authorization: Bearer {access_token}

Response (200):
{
  "totalRecords": 15,
  "statusCounts": {
    "present": 12,
    "absent": 2,
    "late": 1,
    "excused": 0
  },
  "records": [ ... array of attendance records ... ]
}
```

### Get Attendance Record by ID
```
GET /attendance/:id
Headers: Authorization: Bearer {access_token}
```

### Update Attendance Record
```
PUT /attendance/:id
Headers: Authorization: Bearer {access_token}
Content-Type: application/json

{
  "status": "late",
  "remarks": "Traffic jam"
}
```

### Delete Attendance Record
```
DELETE /attendance/:id
Headers: Authorization: Bearer {access_token}

Response (200):
{
  "success": true
}
```

---

## Error Handling

All error responses follow this format:

```json
{
  "statusCode": 400,
  "message": "Error message description",
  "error": "Error Type"
}
```

### Common Error Codes
- **400 Bad Request** - Invalid data or validation error
- **401 Unauthorized** - Missing or invalid token
- **403 Forbidden** - Insufficient permissions
- **404 Not Found** - Resource not found
- **409 Conflict** - Duplicate resource (e.g., email already exists)
- **429 Too Many Requests** - Rate limit exceeded (100 requests/minute)
- **500 Internal Server Error** - Server error

---

## Setup & Installation

### Prerequisites
- Node.js 18+
- MongoDB
- Environment variables setup

### Environment Variables
Create a `.env` file:
```
MONGO_URI=mongodb://localhost:27017/attendance-system
JWT_ACCESS_SECRET=your_access_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_key_here
JWT_ACCESS_EXPIRATION=900
JWT_REFRESH_EXPIRATION=604800
PORT=3000
```

### Installation
```bash
# Install dependencies
npm install

# Run development server
npm run start:dev

# Build for production
npm run build

# Run production server
npm run start:prod
```

---

## Testing the API

### Using cURL
```bash
# Sign Up
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@maejo.ac.th",
    "password": "securePassword123",
    "fullName": "John Doe"
  }'

# Sign In
curl -X POST http://localhost:3000/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@maejo.ac.th",
    "password": "securePassword123"
  }'

# Get User with token
curl -X GET http://localhost:3000/users/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Using Postman
1. Import the endpoints into Postman
2. Set `{{baseUrl}}` to `http://localhost:3000`
3. Add Environment variables for tokens
4. Test each endpoint accordingly

---

## Role-Based Access Control (RBAC)

### Endpoint Permissions

| Endpoint | Admin | Teacher | Student |
|----------|-------|---------|---------|
| POST /users | ✓ | ✗ | ✗ |
| GET /users | ✓ | ✗ | ✗ |
| PUT /users/:id | ✓ | ✗ | ✗ |
| DELETE /users/:id | ✓ | ✗ | ✗ |
| POST /courses | ✓ | ✓ | ✗ |
| GET /courses | ✓ | ✓ | ✓ |
| PUT /courses/:id | ✓ | ✓ | ✗ |
| POST /courses/:id/students/add | ✓ | ✓ | ✗ |
| POST /attendance | ✓ | ✓ | ✗ |
| GET /attendance | ✓ | ✓ | ✓ |
| PUT /attendance/:id | ✓ | ✓ | ✗ |

---

## Features Summary

✅ **User Management**
- Sign up, sign in, refresh tokens, logout
- Role-based user system (Admin, Teacher, Student)
- User profile management

✅ **Course Management**
- Create, read, update, delete courses
- Assign teachers and students to courses
- Filter courses by academic year, semester, teacher

✅ **Attendance Tracking**
- Record individual attendance
- Bulk attendance recording
- Attendance statistics and reports
- Multiple attendance statuses (Present, Absent, Late, Excused)

✅ **Security**
- JWT authentication with access & refresh tokens
- Password hashing with Argon2
- Role-based access control
- Rate limiting (100 requests/minute)
- Input validation with DTOs

✅ **Database**
- MongoDB with Mongoose ODM
- Proper indexing for performance
- Data relationships with references

---

## Project Structure

```
src/
├── auth/
│   ├── decorators/
│   │   ├── current-user.decorator.ts
│   │   └── roles.decorator.ts
│   ├── dto/
│   │   └── auth.dto.ts
│   ├── guards/
│   │   ├── access-token.guard.ts
│   │   ├── refresh-token.guard.ts
│   │   └── roles.guard.ts
│   ├── strategies/
│   │   ├── jwt.strategy.ts
│   │   └── refresh.strategy.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   └── auth.module.ts
├── users/
│   ├── dto/
│   │   └── create-user.dto.ts
│   ├── schemas/
│   │   └── user.schema.ts
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.module.ts
├── courses/
│   ├── dto/
│   │   └── course.dto.ts
│   ├── schemas/
│   │   └── course.schema.ts
│   ├── courses.controller.ts
│   ├── courses.service.ts
│   └── courses.module.ts
├── attendance/
│   ├── dto/
│   │   └── attendance.dto.ts
│   ├── schemas/
│   │   └── attendance.schema.ts
│   ├── attendance.controller.ts
│   ├── attendance.service.ts
│   └── attendance.module.ts
├── app.module.ts
├── app.controller.ts
├── app.service.ts
└── main.ts
```

---

## Author Notes

This system is designed for a university (Maejo University) to track student attendance. It's built following NestJS best practices with:
- Clean architecture with separation of concerns
- Comprehensive error handling
- Input validation using DTOs
- Type-safe queries with TypeScript
- Scalable structure for adding more features

---

## License

UNLICENSED
