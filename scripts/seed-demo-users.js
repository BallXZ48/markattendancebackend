// const mongoose = require('mongoose');
// const argon2 = require('argon2');

// const mongoUri = process.env.MONGO_URI;

// if (!mongoUri) {
//   console.error('MONGO_URI is required. Example:');
//   console.error('set MONGO_URI=mongodb://localhost:27017/attendance-system');
//   process.exit(1);
// }

// async function run() {
//   await mongoose.connect(mongoUri);

//   const db = mongoose.connection.db;
//   const users = db.collection('users');

//   const studentPassword = process.env.DEMO_STUDENT_PASSWORD || 'student123';
//   const teacherPassword = process.env.DEMO_TEACHER_PASSWORD || 'teacher123';
//   const adminPassword = process.env.DEMO_ADMIN_PASSWORD || 'admin123';

//   const [studentHash, teacherHash, adminHash] = await Promise.all([
//     argon2.hash(studentPassword),
//     argon2.hash(teacherPassword),
//     argon2.hash(adminPassword),
//   ]);

//   const now = new Date();

//   await users.updateOne(
//     { email: 'student1@student.mju.ac.th' },
//     {
//       $set: {
//         email: 'student1@student.mju.ac.th',
//         fullName: 'Demo Student',
//         passwordHash: studentHash,
//         role: 'student',
//         studentId: 'S-DEMO-001',
//         department: 'Computer Science',
//         isActive: true,
//         updatedAt: now,
//       },
//       $setOnInsert: { createdAt: now },
//     },
//     { upsert: true },
//   );

//   await users.updateOne(
//     { email: 'teacher@teacher.mju.ac.th' },
//     {
//       $set: {
//         email: 'teacher@teacher.mju.ac.th',
//         fullName: 'Demo Teacher',
//         passwordHash: teacherHash,
//         role: 'teacher',
//         department: 'Computer Science',
//         isActive: true,
//         updatedAt: now,
//       },
//       $setOnInsert: { createdAt: now },
//     },
//     { upsert: true },
//   );

//   await users.updateOne(
//     { email: 'admin1@admin.mju.ac.th' },
//     {
//       $set: {
//         email: 'admin1@admin.mju.ac.th',
//         fullName: 'Demo Admin',
//         passwordHash: adminHash,
//         role: 'admin',
//         department: 'Administration',
//         isActive: true,
//         updatedAt: now,
//       },
//       $setOnInsert: { createdAt: now },
//     },
//     { upsert: true },
//   );

//   console.log('Demo users upserted successfully.');
//   console.log('Student: student1@student.mju.ac.th /', studentPassword);
//   console.log('Teacher: teacher@teacher.mju.ac.th /', teacherPassword);
//   console.log('Admin: admin1@admin.mju.ac.th /', adminPassword);

//   await mongoose.disconnect();
// }

// run().catch(async (error) => {
//   console.error('Failed to seed demo users:', error.message);
//   try {
//     await mongoose.disconnect();
//   } catch {
//     // ignore
//   }
//   process.exit(1);
// });
