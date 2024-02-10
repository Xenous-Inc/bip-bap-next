import Link from 'next/link';
import { getServerAuthSession } from '~/server';
import { api } from '~/trpc/server';
import { PersonalPage } from '~/widgets/PersonalPage';

export default async () => {
    const hello = await api.post.hello.query({ text: 'from tRPC' });

    const session = await getServerAuthSession();

    return (
        <main className='flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white'>
            <PersonalPage />
        </main>
    );
};
