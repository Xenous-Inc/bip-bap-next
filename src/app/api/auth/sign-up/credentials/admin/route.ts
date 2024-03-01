import { UserType } from '@prisma/client';
import bcrypt from 'bcrypt';
import { type NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '~/server/db';
import { type SignUpCredentialsSchema, signUpCredentialsSchema } from '~/shared/api';

export const POST = async (request: NextRequest) => {
    const session = await getServerSession();

    if (session?.user.type !== UserType.ADMIN) {
        return new NextResponse(undefined, { status: 403 });
    }

    const input = (await request.json()) as SignUpCredentialsSchema;
    signUpCredentialsSchema.parse(input);

    const exist = await db.user.findUnique({ where: { email: input.data.email } });

    if (exist) {
        return NextResponse.json({ message: 'Пользователь с такой почтой уже существует' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(input.data.password, 10);

    await db.user.create({
        data: {
            email: input.data.email,
            password: hashedPassword,
            type: UserType.ADMIN,
        },
    });

    return new NextResponse(undefined, { status: 201 });
};
