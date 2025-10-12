require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

async function seed(){
  await mongoose.connect(process.env.MONGO_URI);
  await User.deleteMany({});
  const pw = await bcrypt.hash('password123', 10);
  await User.create({ name: 'Alice Admin', email: 'admin@example.com', passwordHash: pw, role: 'admin' });
  await User.create({ name: 'Maya Manager', email: 'manager@example.com', passwordHash: pw, role: 'manager', department: 'Engineering' });
  await User.create({ name: 'Raj Employee', email: 'raj@example.com', passwordHash: pw, role: 'employee', department: 'Engineering', position: 'Developer' });
  console.log('Seeded');
  process.exit(0);
}
seed();
