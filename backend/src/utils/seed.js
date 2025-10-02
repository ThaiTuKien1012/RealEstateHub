import bcrypt from 'bcryptjs';
import { db } from '../config/database.js';
import { users, watches } from '../models/schema.js';
import { eq } from 'drizzle-orm';

import productsData from './products.json' assert { type: 'json' };

const luxuryWatches = productsData;

export async function seedDatabase() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@watchshop.com';
    const [existingAdmin] = await db.select().from(users).where(eq(users.email, adminEmail));

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(
        process.env.ADMIN_PASSWORD || 'Admin123!@#',
        10
      );

      await db.insert(users).values({
        email: adminEmail,
        password: hashedPassword,
        firstName: process.env.ADMIN_FIRST_NAME || 'Admin',
        lastName: process.env.ADMIN_LAST_NAME || 'User',
        role: 'admin',
        isVerified: true
      });

      console.log(`✅ Admin user created: ${adminEmail}`);
    } else {
      console.log(`ℹ️  Admin user already exists: ${adminEmail}`);
    }

    const [existingWatch] = await db.select().from(watches).limit(1);

    if (!existingWatch) {
      await db.insert(watches).values(luxuryWatches);
      console.log(`✅ Seeded ${luxuryWatches.length} luxury watches`);
    } else {
      console.log(`ℹ️  Watches already seeded`);
    }

  } catch (error) {
    console.error('Seed error:', error);
    throw error;
  }
}
