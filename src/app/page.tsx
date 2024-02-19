'use client';
import Link from 'next/link';
import { getServerAuthSession } from '~/server';
import { api } from '~/trpc/react';
import { Header } from '~/widgets/Header';
import { SensorInfo } from '~/widgets/SensorInfo';

export default async () => {
    return (
        <main className='flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white'></main>
    );
};
