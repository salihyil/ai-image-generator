import * as z from 'zod';

export const passwordConditions = [
  { key: 'length', text: 'At least 6 characters', regex: /.{6,}/ },
  { key: 'uppercase', text: 'At least one uppercase letter', regex: /[A-Z]/ },
  { key: 'lowercase', text: 'At least one lowercase letter', regex: /[a-z]/ },
  { key: 'number', text: 'At least one number', regex: /\d/ },
  { key: 'special', text: 'At least one special character', regex: /[!@#$%^&*(),.?":{}|<>]/ },
] as const;

export const registerSchema = z
  .object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(1, 'Password is required')
      .refine(
        (password) => passwordConditions.every(({ regex }) => regex.test(password)),
        (password) => ({
          message: `Password must contain ${passwordConditions
            .filter(({ regex }) => !regex.test(password))
            .map(({ text }) => text.toLowerCase())
            .join(', ')}`,
        })
      ),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });
