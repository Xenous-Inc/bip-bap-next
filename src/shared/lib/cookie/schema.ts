import { z } from 'zod';
import { type EnumType } from '../types';

export const CookieKey = {
    THEME: 'theme',
    OPTIONAL: 'optional',
} as const;

export const cookieSchema = {
    [CookieKey.THEME]: z.enum(['light', 'dark']).default('light'),
    [CookieKey.OPTIONAL]: z.enum(['light', 'dark']).optional(),
} as const satisfies Record<EnumType<typeof CookieKey>, z.ZodDefault<z.ZodType> | z.ZodOptional<z.ZodType>>;
