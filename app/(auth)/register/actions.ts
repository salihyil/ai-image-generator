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
  // Check if user already exists
  const existingUser = await db.select().from(usersTable).where(eq(usersTable.email, data.email)).limit(1);

  if (existingUser.length > 0) {
    throw new Error('A user with this email already exists');
  }

  // If user doesn't exist, proceed with registration
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const [newUser] = await db.insert(usersTable).values({
    name: data.name,
    email: data.email,
    password: hashedPassword,
  }).returning();

  return newUser;
}
