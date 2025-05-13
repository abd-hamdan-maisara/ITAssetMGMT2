import { db } from './server/db.js';
import { users, UserRoles } from './shared/schema.js';
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString('hex')}.${salt}`;
}

async function createAdminUser() {
  // Check if admin already exists
  const existingAdmin = await db.select().from(users).where({ username: 'admin' });
  
  if (existingAdmin.length > 0) {
    console.log('Admin user already exists');
    process.exit(0);
  }
  
  const hashedPassword = await hashPassword('admin123');
  
  // Create admin user
  const adminUser = {
    username: 'admin',
    password: hashedPassword,
    email: 'admin@itmanager.com',
    fullName: 'System Administrator',
    role: UserRoles.ADMIN,
    department: 'IT'
  };
  
  await db.insert(users).values(adminUser);
  console.log('Admin user created successfully');
  process.exit(0);
}

createAdminUser().catch(err => {
  console.error('Error creating admin user:', err);
  process.exit(1);
});
