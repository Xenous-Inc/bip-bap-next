import { z } from 'zod';

export const updateUserPasswordSchema = z
    .object({
        email: z.string(),
        phoneNumber: z.string(), //TODO: resolve
        oldPassword: z.string(),
        newPassword: z.string(),
    })
    .partial();

export type UpdateUserPasswordSchema = z.infer<typeof updateUserPasswordSchema>;
