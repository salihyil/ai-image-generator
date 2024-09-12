'use server';

import { db } from '@/db';
import { passwordResetTokens, usersTable } from '@/db/schema';
import { EmailTemplate, sendMail } from '@/email';
import { Paths } from '@/lib/constants';
import { resetPasswordSchema } from '@/schema/resetPasswordSchema';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { createDate, isWithinExpirationDate, TimeSpan } from 'oslo';
import { z } from 'zod';

export async function resetPassword(
  _: any,
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const obj = Object.fromEntries(formData.entries());

  const parsed = resetPasswordSchema.safeParse(obj);

  if (!parsed.success) {
    const err = parsed.error.flatten();
    return {
      error: err.fieldErrors.password?.[0] ?? err.fieldErrors.token?.[0],
    };
  }
  const { token, password } = parsed.data;

  // Find the token without using a transaction
  const dbToken = await db.query.passwordResetTokens.findFirst({
    where: (table, { eq }) => eq(table.id, token),
  });

  if (!dbToken) return { error: 'Invalid password reset link' };

  if (!isWithinExpirationDate(dbToken.expiresAt)) return { error: 'Password reset link expired.' };

  // Delete the token
  await db.delete(passwordResetTokens).where(eq(passwordResetTokens.id, dbToken.id));

  const hashedPassword = await bcrypt.hash(password, 10);
  await db
    .update(usersTable)
    .set({ password: hashedPassword })
    .where(eq(usersTable.id, dbToken.userId));

  redirect(Paths.Login);
}

export async function sendPasswordResetLink(
  _: any,
  formData: FormData
): Promise<{ error?: string; success?: boolean; emailResponse?: string }> {
  const email = formData.get('email');

  const parsed = z.string().trim().email().safeParse(email);
  if (!parsed.success) {
    return { error: 'Provided email is invalid.' };
  }
  try {
    const user = await db.query.usersTable.findFirst({
      where: (table, { eq }) => eq(table.email, parsed.data),
    });

    // TODO: Add email verification -> if (!user || !user.emailVerified) return { error: 'Provided email is invalid.' };
    if (!user) return { error: 'Provided email is invalid.' };

    const verificationToken = await generatePasswordResetToken(user.id);

    const verificationLink = `${process.env.NEXTAUTH_URL}/reset-password/${verificationToken}`;

    await sendMail(user.email, EmailTemplate.PasswordReset, { link: verificationLink });

    return { success: true };
  } catch (error) {
    return { error: 'Failed to send verification email.' };
  }
}

async function generatePasswordResetToken(userId: string) {
  await db.delete(passwordResetTokens).where(eq(passwordResetTokens.userId, userId));
  const tokenId = crypto.randomUUID();
  await db.insert(passwordResetTokens).values({
    id: tokenId,
    userId,
    expiresAt: createDate(new TimeSpan(2, 'h')),
  });

  return tokenId;
}
