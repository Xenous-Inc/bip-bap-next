import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { type UserType } from '@prisma/client';
import bcrypt from 'bcrypt';
import { getServerSession, type DefaultSession, type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from '../db';

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module 'next-auth' {
    interface Session extends DefaultSession {
        user: {
            id: string;
            // ...other properties
            type: UserType;
        } & DefaultSession['user'];
    }
}

/**
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
    callbacks: {
        session: ({ session, user }) => ({
            ...session,
            user: {
                ...session.user,
                id: user.id,
            },
        }),
    },
    adapter: PrismaAdapter(db),
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'email', type: 'email', placeholder: 'Enter email' },
                password: { label: 'Password', type: 'password' },
            },
            authorize: async credentials => {
                if (!credentials?.email || !credentials.password) {
                    return null;
                }

                const user = await db.user.findUnique({
                    where: { email: credentials?.email },
                });

                if (!user?.password) return null;

                const passwordsMatch = await bcrypt.compare(credentials.password, user.password);

                if (!passwordsMatch) return null;

                return user;
            },
        }),
    ],
};

export const getServerAuthSession = () => getServerSession(authOptions);
