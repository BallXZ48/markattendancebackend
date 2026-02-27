# Quick Start Guide - Testing the Attendance System API

## Setup (5 minutes)

### 1. Start MongoDB
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas connection string in .env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/attendance-system
```

### 2. Create .env File
```bash
MONGO_URI=mongodb://localhost:27017/attendance-system
JWT_ACCESS_SECRET=your_super_secret_access_key_2566
JWT_REFRESH_SECRET=your_super_secret_refresh_key_2566
JWT_ACCESS_EXPIRATION=900
JWT_REFRESH_EXPIRATION=604800
PORT=3000
```

### 3. Install & Run
```bash
npm install
npm run start:dev
```

Server should run on `http://localhost:3000`

---

## Complete Test Flow (15 minutes)

### Using Thunder Client, Postman, or cURL

#### **1️⃣ Sign Up (Create Regular Student Account)**
```
POST http://localhost:3000/auth/signup
Content-Type: application/json

{
  "email": "student1@maejo.ac.th",
  "password": "Password123!",
  "fullName": "Somchai Student"
}
```
**Save the `access_token` from response**

---

#### **2️⃣ Create Admin Account**
```
POST http://localhost:3000/auth/signup
Content-Type: application/json

{
  "email": "admin@maejo.ac.th",
  "password": "AdminPass123!",
  "fullName": "Admin User"
}
```
**Save the `access_token` - this will be our Admin token**

---

#### **3️⃣ Promote Student Account to Admin** 
*Use token from step 2 (Admin)*

```
PUT http://localhost:3000/users/{USER_ID_FROM_STEP_2}/role
Headers: Authorization: Bearer {ADMIN_TOKEN}
Content-Type: application/json

{
  "role": "admin"
}
```

---

#### **4️⃣ Create Teacher Account**
*Use Admin token from step 3*

```
POST http://localhost:3000/users
Headers: Authorization: Bearer {ADMIN_TOKEN}
Content-Type: application/json

{
  "email": "teacher@maejo.ac.th",
  "password": "TeacherPass123!",
  "fullName": "Dr. Setsiri Teacher",
  "role": "teacher",
  "department": "Computer Science"
}
```
**Save the teacher user `_id` from response**

---

#### **5️⃣ Create Multiple Student Accounts**
*Use Admin token*

**Student 1:**
```
POST http://localhost:3000/users
Headers: Authorization: Bearer {ADMIN_TOKEN}
Content-Type: application/json

{
  "email": "john.doe@maejo.ac.th",
  "password": "StudentPass123!",
  "fullName": "John Doe",
  "role": "student",
  "studentId": "6410001",
  "department": "Computer Science"
}
```
**Save student 1 `_id`**

**Student 2:**
```
POST http://localhost:3000/users
Headers: Authorization: Bearer {ADMIN_TOKEN}

{
  "email": "jane.smith@maejo.ac.th",
  "password": "StudentPass123!",
  "fullName": "Jane Smith",
  "role": "student",
  "studentId": "6410002",
  "department": "Computer Science"
}
```
**Save student 2 `_id`**

**Student 3:**
```
POST http://localhost:3000/users
Headers: Authorization: Bearer {ADMIN_TOKEN}

{
  "email": "bob.wilson@maejo.ac.th",
  "password": "StudentPass123!",
  "fullName": "Bob Wilson",
  "role": "student",
  "studentId": "6410003",
  "department": "Computer Science"
}
```
**Save student 3 `_id`**

---

#### **6️⃣ Create Course**
*Use Admin or Teacher token*

```
POST http://localhost:3000/courses
Headers: Authorization: Bearer {TEACHER_TOKEN}
Content-Type: application/json

{
  "courseCode": "CS101",
  "courseName": "Introduction to Programming",
  "description": "Learn fundamentals of programming with hands-on exercises",
  "teacherId": "{TEACHER_USER_ID}",
  "department": "Computer Science",
  "semester": 1,
  "academicYear": 2566,
  "totalClasses": 15,
  "credits": 3
}
```
**Save course `_id`**

---

#### **7️⃣ Add Students to Course**
*Use Admin or Teacher token*

```
POST http://localhost:3000/courses/{COURSE_ID}/students/add
Headers: Authorization: Bearer {TEACHER_TOKEN}
Content-Type: application/json

{
  "studentIds": [
    "{STUDENT_1_ID}",
    "{STUDENT_2_ID}",
    "{STUDENT_3_ID}"
  ]
}
```

---

#### **8️⃣ Record Attendance (Individual)**
*Use Teacher token*

```
POST http://localhost:3000/attendance
Headers: Authorization: Bearer {TEACHER_TOKEN}
Content-Type: application/json

{
  "courseId": "{COURSE_ID}",
  "studentId": "{STUDENT_1_ID}",
  "classDate": "2026-02-20T10:30:00Z",
  "status": "present",
  "remarks": "On time, prepared well",
  "sessionNumber": 1
}
```

Record more attendance:

**Student 2 - Late:**
```
POST http://localhost:3000/attendance
Headers: Authorization: Bearer {TEACHER_TOKEN}

{
  "courseId": "{COURSE_ID}",
  "studentId": "{STUDENT_2_ID}",
  "classDate": "2026-02-20T10:30:00Z",
  "status": "late",
  "remarks": "Traffic jam",
  "sessionNumber": 1
}
```

**Student 3 - Absent:**
```
POST http://localhost:3000/attendance
Headers: Authorization: Bearer {TEACHER_TOKEN}

{
  "courseId": "{COURSE_ID}",
  "studentId": "{STUDENT_3_ID}",
  "classDate": "2026-02-20T10:30:00Z",
  "status": "absent",
  "sessionNumber": 1
}
```

---

#### **9️⃣ Record Bulk Attendance (Next Class)**
*Use Teacher token*

```
POST http://localhost:3000/attendance/bulk
Headers: Authorization: Bearer {TEACHER_TOKEN}
Content-Type: application/json

{
  "courseId": "{COURSE_ID}",
  "classDate": "2026-02-22T10:30:00Z",
  "attendanceRecords": [
    {
      "studentId": "{STUDENT_1_ID}",
      "status": "present",
      "remarks": "Good participation"
    },
    {
      "studentId": "{STUDENT_2_ID}",
      "status": "present",
      "remarks": "Better than last time"
    },
    {
      "studentId": "{STUDENT_3_ID}",
      "status": "excused",
      "remarks": "Medical appointment"
    }
  ]
}
```

---

#### **🔟 View Course Attendance**
*Use Teacher or Admin token*

```
GET http://localhost:3000/attendance/course/{COURSE_ID}
Headers: Authorization: Bearer {TEACHER_TOKEN}
```
**Response: Array of all attendance records for the course**

---

#### **1️⃣1️⃣ Get Student Attendance Stats**
*Use Teacher, Admin, or Student token (can see own)*

```
GET http://localhost:3000/attendance/stats/student/{STUDENT_1_ID}/course/{COURSE_ID}
Headers: Authorization: Bearer {STUDENT_TOKEN}
```

**Response:**
```json
{
  "studentId": "{STUDENT_1_ID}",
  "courseId": "{COURSE_ID}",
  "totalClasses": 2,
  "statusCounts": {
    "present": 2,
    "absent": 0,
    "late": 0,
    "excused": 0
  },
  "presentPercentage": "100.00"
}
```

---

#### **1️⃣2️⃣ Get Attendance Report**
*Use Teacher or Admin token*

```
GET http://localhost:3000/attendance/report?courseId={COURSE_ID}
Headers: Authorization: Bearer {TEACHER_TOKEN}
```

**With Date Range:**
```
GET http://localhost:3000/attendance/report?courseId={COURSE_ID}&startDate=2026-02-20&endDate=2026-02-28
Headers: Authorization: Bearer {TEACHER_TOKEN}
```

**Response:**
```json
{
  "totalRecords": 6,
  "statusCounts": {
    "present": 4,
    "absent": 1,
    "late": 1,
    "excused": 1
  },
  "records": [...]
}
```

---

#### **1️⃣3️⃣ View All Users**
*Use Admin token only*

```
GET http://localhost:3000/users
Headers: Authorization: Bearer {ADMIN_TOKEN}
```

**Filter by role:**
```
GET http://localhost:3000/users?role=student
GET http://localhost:3000/users?role=teacher
GET http://localhost:3000/users?role=admin
```

---

#### **1️⃣4️⃣ View All Courses**
*Use any token*

```
GET http://localhost:3000/courses
Headers: Authorization: Bearer {ANY_TOKEN}
```

**Filter:**
```
GET http://localhost:3000/courses?academicYear=2566
GET http://localhost:3000/courses?semester=1
GET http://localhost:3000/courses?teacherId={TEACHER_ID}
```

---

#### **1️⃣5️⃣ Student Views Their Own Courses**
*Use Student token*

```
GET http://localhost:3000/courses/student/{STUDENT_1_ID}
Headers: Authorization: Bearer {STUDENT_1_TOKEN}
```

---

## Key Test Scenarios

### ✅ Success Cases
- [x] Sign up as student (default role)
- [x] Create users with different roles (admin, teacher, student)
- [x] Update user role
- [x] Create course with teacher assignment
- [x] Add multiple students to course
- [x] Record individual attendance
- [x] Record bulk attendance
- [x] View attendance reports
- [x] Filter and query all entities
- [x] Calculate attendance statistics

### ❌ Error Cases to Try
```
# Missing token
GET http://localhost:3000/users

# Invalid token
GET http://localhost:3000/users
Headers: Authorization: Bearer invalid_token

# Insufficient permissions (student trying to create course)
POST http://localhost:3000/courses
Headers: Authorization: Bearer {STUDENT_TOKEN}

# Duplicate email registration
POST http://localhost:3000/auth/signup
{
  "email": "student1@maejo.ac.th",  // Already exists
  "password": "NewPass123!",
  "fullName": "Different Name"
}

# Duplicate attendance record (same student, course, date)
POST http://localhost:3000/attendance
Headers: Authorization: Bearer {TEACHER_TOKEN}
{
  "courseId": "{COURSE_ID}",
  "studentId": "{STUDENT_1_ID}",
  "classDate": "2026-02-20T10:30:00Z",  // Same as record from step 8
  "status": "absent"
}
```

---

## Response Examples

### Success (200/201)
```json
{
  "_id": "507f1f77bcf86cd799439015",
  "email": "student@maejo.ac.th",
  "fullName": "John Doe",
  "role": "student",
  "studentId": "6410001",
  "isActive": true,
  "createdAt": "2026-02-20T10:00:00.000Z",
  "updatedAt": "2026-02-20T10:00:00.000Z"
}
```

### Error (400/401/403)
```json
{
  "statusCode": 400,
  "message": "Email นี้ถูกใช้งานแล้ว",
  "error": "Bad Request"
}
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "MongoDB connection failed" | Check MongoDB is running and MONGO_URI is correct |
| "Invalid token" | Ensure token hasn't expired, use refresh endpoint |
| "Insufficient permissions" | Use correct role token, check @Roles decorator |
| "Email already exists" | Use unique email for new registrations |
| "Course not found" | Verify course ID exists before operations |
| "Duplicate attendance" | Same student+course+date already recorded |

---

## Pro Tips 💡

1. **Save IDs as you go** - Copy user/course IDs to use in next requests
2. **Token Management** - Keep track of different role tokens (student, teacher, admin)
3. **Date Format** - Use ISO format: `2026-02-20T10:30:00Z`
4. **Bulk Operations** - More efficient than recording one by one
5. **Filtering** - Use query parameters to reduce data returned
6. **Get User ID** - Check response from signup/user creation endpoints

---

## Common Test Sequence

```
1. Sign up Admin → Get admin token
2. Create Teacher → Get teacher ID
3. Create 3 Students → Get student IDs
4. Create Course → Get course ID
5. Add students to course
6. Record attendance (session 1)
7. Record bulk attendance (session 2)
8. View stats/reports
9. Test role-based access
10. Test error cases
```

---

**Demo Ready!** 🎉

This flow is perfect for a 15-minute presentation showing:
- ✅ Authentication system
- ✅ Role-based access
- ✅ Database relationships
- ✅ CRUD operations
- ✅ Data validation
- ✅ Real-world workflow
