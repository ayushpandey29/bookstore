import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

const sql = neon(process.env.DATABASE_URL);

async function seed() {
  const password = await bcrypt.hash('admin123', 12);
  
  await sql`
    INSERT INTO admin_users (username, password_hash)
    VALUES ('admin', ${password})
    ON CONFLICT (username) DO NOTHING
  `;
  
  console.log('Admin user seeded (username: admin, password: admin123)');
}

seed().catch(console.error);
