import { PrismaClient } from '@prisma/client';
import { env } from '~/shared/lib';

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const db =
    globalForPrisma.prisma ??
    new PrismaClient({
        log: env.NEXT_PUBLIC_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });

if (env.NEXT_PUBLIC_ENV !== 'production') globalForPrisma.prisma = db;
