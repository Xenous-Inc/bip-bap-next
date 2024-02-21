'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import IconBell from '~/shared/assets/icons/icon_bell.svg';
import IconBookmark from '~/shared/assets/icons/icon_bookmark.svg';
import IconList from '~/shared/assets/icons/icon_list.svg';
import IconMap from '~/shared/assets/icons/icon_map.svg';
import IconRating from '~/shared/assets/icons/icon_rating.svg';
import IconUser from '~/shared/assets/icons/icon_user.svg';
import { NavLink } from './NavLink';

export const Header: React.FC = () => {
    // const session = useSession();

    return (
        <header className={'fixed z-50 flex w-full flex-row items-center justify-between bg-white px-32  text-black'}>
            <Link href={'/'} className={'border-t-4 border-y-white text-2xl font-bold text-header-blue'}>
                Bip-Bap
            </Link>
            <nav className={'flex flex-row gap-10'}>
                <NavLink href={'/map'}>
                    <IconMap className={'h-6 w-6'} />
                    Карта
                </NavLink>
                <NavLink href={'/list'}>
                    <IconList className={'h-6 w-6'} />
                    Список датчиков
                </NavLink>
                <NavLink href={'/rank'}>
                    <IconRating className={'h-6 w-6'} /> Рейтинг городов
                </NavLink>
                <NavLink href={'/subscribe'}>
                    <IconBell className={'h-6 w-6'} /> Подписки
                </NavLink>
                <NavLink href={'/favorite'}>
                    <IconBookmark className={'h-6 w-6'} /> Избранные датчики
                </NavLink>
            </nav>
            {/* {session.status === 'authenticated' && (
                <Link href={'/profile'}>
                    <IconUser className={'h-6 w-6'} />
                </Link>
            )}
            {session.status === 'unauthenticated' && (
                <>
                    <button onClick={console.log}>
                        <IconUser className={'h-6 w-6'} />
                    </button>
                    {todo: add popups here }
                </>
            )} */}
        </header>
    );
};
