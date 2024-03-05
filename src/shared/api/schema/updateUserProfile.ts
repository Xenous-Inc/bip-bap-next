import { z } from 'zod';

export const updateUserProfileSchema = z
    .object({
        name: z.string(),
        imageURL: z.string().url(),
    })
    .partial();

export type UpdateUserProfileSchema = z.infer<typeof updateUserProfileSchema>;
