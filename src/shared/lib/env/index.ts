import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
    server: {
        POSTGRES_PRISMA_URL: z.string().url(),
        POSTGRES_URL_NON_POOLING: z.string().url(),
        NEXTAUTH_SECRET: process.env.NODE_ENV === 'production' ? z.string() : z.string().optional(),
        NEXTAUTH_URL: z.preprocess(
            str => process.env.VERCEL_URL ?? str,
            process.env.VERCEL ? z.string() : z.string().url()
        ),
    },
    client: {
        NEXT_PUBLIC_ENV: z.enum(['development', 'test', 'production']).default('development'),
        NEXT_PUBLIC_REST_URL: z.preprocess(
            str => process.env.VERCEL_URL ?? str,
            process.env.VERCEL ? z.string() : z.string().url().optional()
        ),
    },
    runtimeEnv: {
        NEXT_PUBLIC_ENV: process.env.NODE_ENV,
        NEXT_PUBLIC_REST_URL: process.env.NEXT_PUBLIC_REST_URL,

        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,

        POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL,
        POSTGRES_URL_NON_POOLING: process.env.POSTGRES_URL_NON_POOLING,
    },
    skipValidation: !!process.env.SKIP_ENV_VALIDATION,
    emptyStringAsUndefined: true,
});
