import { z } from 'zod';

export const password = z
    .object({
        oldPassword: z.string(),
        newPassword: z.string(),
    })
    .partial();

export type UpdateUserProfileSchema = z.infer<typeof password>;
