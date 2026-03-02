import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

async function migrate() {
  console.log('Starting migration...');

  // Drop existing tables to ensure clean slate and correct schema
  console.log('Dropping existing tables...');
  await sql`DROP TABLE IF EXISTS orders CASCADE`;
  await sql`DROP TABLE IF EXISTS admin_users CASCADE`;
  await sql`DROP TABLE IF EXISTS users CASCADE`;

  // Create users table for customers
  await sql`
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(200) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  console.log('Created users table');

  // Create admin_users table
  await sql`
    CREATE TABLE admin_users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(100) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  console.log('Created admin_users table');

  // Create orders table
  await sql`
    CREATE TABLE orders (
      id SERIAL PRIMARY KEY,
      order_id VARCHAR(50) UNIQUE NOT NULL,
      customer_name VARCHAR(200) NOT NULL,
      customer_email VARCHAR(255) NOT NULL,
      customer_phone VARCHAR(20) NOT NULL,
      shipping_address TEXT NOT NULL,
      transaction_id VARCHAR(100),
      items JSONB NOT NULL,
      subtotal INTEGER NOT NULL,
      shipping INTEGER NOT NULL,
      tax INTEGER NOT NULL,
      grand_total INTEGER NOT NULL,
      status VARCHAR(30) DEFAULT 'processing' NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  console.log('Created orders table');

  // Create indexes
  await sql`CREATE INDEX idx_orders_status ON orders(status)`;
  await sql`CREATE INDEX idx_orders_order_id ON orders(order_id)`;
  await sql`CREATE INDEX idx_orders_email ON orders(customer_email)`;
  await sql`CREATE INDEX idx_orders_created_at ON orders(created_at DESC)`;
  await sql`CREATE INDEX idx_users_email ON users(email)`;
  console.log('Created indexes');

  // Seed default admin user: admin / admin123
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await sql`
    INSERT INTO admin_users (username, password_hash)
    VALUES ('admin', ${hashedPassword})
  `;
  console.log('Seed: Created admin user (admin / admin123)');

  console.log('Migration and seeding complete!');
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
