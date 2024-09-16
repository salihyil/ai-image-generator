'use server';

import { db } from '@/db';
import { usersTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  try {
    // Check if user already exists
    const existingUser = await db.select().from(usersTable).where(eq(usersTable.email, data.email)).limit(1);

    if (existingUser.length > 0) {
      return { success: false, error: 'A user with this email already exists' };
    }

    // If user doesn't exist, proceed with registration
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const [newUser] = await db.insert(usersTable).values({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    }).returning();

    return { success: true, user: newUser };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: 'An unexpected error occurred during registration' };
  }
}
