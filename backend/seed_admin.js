// Seed an admin user (runs standalone)
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const MONGO = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/asrar_perfume';

async function run() {
  await mongoose.connect(MONGO);
  console.log('Connected to MongoDB for admin seeding');

  const email = process.env.ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.ADMIN_PASSWORD || 'admin123';

  let admin = await User.findOne({ email });
  if (admin) {
    console.log('Admin already exists:', email);
    process.exit(0);
  }

  const hashed = await bcrypt.hash(password, 10);
  admin = new User({ name: 'Admin', email, password: hashed, isAdmin: true });
  await admin.save();
  console.log('Admin user created:', email, 'with password', password);
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
