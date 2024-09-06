'use server';

import { db } from '@/db';
import { usersTable } from '@/db/schema';
import { registerSchema } from '@/schema/registerSchema';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

export async function registerUser(data: z.infer<typeof registerSchema>) {
  // Hash the password
  const hashedPassword = await bcrypt.hash(data.password, 10);

  // Insert the new user into the database
  const [newUser] = await db
    .insert(usersTable)
    .values({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    })
    .returning();

  return newUser;
}
