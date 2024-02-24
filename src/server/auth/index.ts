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
        jwt: async ({ token }) => {
            if (!token.email) return token;

            const user = await db.user.findUnique({ where: { id: token.sub } });

            if (!user) return token;

            return {
                ...token,
                type: user.type,
            };
        },
        session: ({ session, token }) => ({
            ...session,
            user: {
                ...session.user,
                id: token.sub,
                type: token.type,
            },
        }),
    },
    adapter: PrismaAdapter(db),
    providers: [
        CredentialsProvider({
            name: 'credentials',
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
                console.log('USER', user);
                if (!user?.password) return null;

                const passwordsMatch = await bcrypt.compare(credentials.password, user.password);
                console.log('PASSWORD', passwordsMatch);
                if (!passwordsMatch) return null;

                return user;
            },
        }),
    ],
};

export const getServerAuthSession = () => getServerSession(authOptions);
