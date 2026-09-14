import dotenv from 'dotenv';
import { connectDB } from './src/config/db.js';
import { User } from './src/models/User.js';
import { Subject } from './src/models/Subject.js';

dotenv.config();

const SUBJECTS = [
  { name: 'Engineering Mathematics I', code: 'MAT101', branch: 'CSE', semester: 1 },
  { name: 'Programming for Problem Solving', code: 'CSE101', branch: 'CSE', semester: 1 },
  { name: 'Data Structures & Algorithms', code: 'CSE301', branch: 'CSE', semester: 3 },
  { name: 'Operating Systems', code: 'CSE401', branch: 'CSE', semester: 4 },
  { name: 'Database Management Systems', code: 'CSE501', branch: 'CSE', semester: 5 },
  { name: 'Computer Networks', code: 'CSE601', branch: 'CSE', semester: 6 },
  { name: 'Digital Electronics', code: 'ECE201', branch: 'ECE', semester: 2 },
  { name: 'DBMS', code: 'IT501', branch: 'IT', semester: 5 },
];

const seed = async () => {
  await connectDB();

  let admin = await User.findOne({ email: 'admin@gcetnotes.com' });
  if (!admin) {
    admin = await User.create({
      name: 'GCET Admin',
      email: 'admin@gcetnotes.com',
      password: 'admin12345',
      role: 'Admin',
    });
    console.log('Admin created: admin@gcetnotes.com / admin12345');
  } else {
    console.log('Admin already exists');
  }

  for (const sub of SUBJECTS) {
    await Subject.findOneAndUpdate(
      { code: sub.code, branch: sub.branch },
      { ...sub, createdBy: admin._id, isActive: true },
      { upsert: true, new: true }
    );
  }
  console.log(`Seeded ${SUBJECTS.length} subjects`);

  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
