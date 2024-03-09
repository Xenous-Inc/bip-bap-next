import { z } from 'zod';

export const updateUserPasswordSchema = z.object({
    email: z.string().email().optional(),
    phoneNumber: z.string().optional(), //TODO: resolve
    oldPassword: z.string().min(8),
    newPassword: z.string().min(8),
});

export type UpdateUserPasswordSchema = z.infer<typeof updateUserPasswordSchema>;
