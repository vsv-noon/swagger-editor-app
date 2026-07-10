import { z } from 'zod';

export const signInSchema = z.object({
  email: z.email('incorrect email format'),
  password: z.string(),
});

export const signUpSchema = z.object({
  name: z.string().min(3).max(30),
  email: z.email('incorrect email format'),
  password: z
    .string()
    .min(8)
    .regex(/(?=.*\d)/, 'must contain at least one digit')
    .regex(/(?=.*[a-z])/, 'must contain at least one lowercase letter')
    .regex(/(?=.*[A-Z])/, 'must contain one uppercase letter')
    .regex(
      /(?=.*[!@#$%^&*()_+\-=\\[\]{};':"\\|,.<>\\/?])/,
      'must contain special character'
    )
    .regex(/^[\p{L}\p{N}\p{P}\p{S}]+$/u, 'invalid characters'),
});

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
