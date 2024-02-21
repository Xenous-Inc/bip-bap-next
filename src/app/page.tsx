'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getServerAuthSession } from '~/server';
import { useSessionStorageState } from '~/shared/lib/hooks/sessionStorage/useSessionStorage';
import { api } from '~/trpc/react';
import { FilterMenu } from '~/widgets/FilterMenu';
import { Header } from '~/widgets/Header';
import { SensorInfo } from '~/widgets/SensorInfo';

export default () => {
    const [isOpen, setIsOpen] = useState(false);
    const sessionState = sessionStorage;
    useEffect(() => {
        console.log(sessionState);
    }, [sessionState]);
    return (
        <main className='flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white'>
            <button className={'h-12 w-12'} onClick={() => setIsOpen(true)}>
                AAAAAAAAA
            </button>
            <FilterMenu isOpen={isOpen} setIsOpen={setIsOpen} />
        </main>
    );
};
