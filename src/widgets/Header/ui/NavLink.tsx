'use client';

import cn from 'classnames';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

type NavLinkProps = React.PropsWithChildren & {
    href: string;
    exact?: boolean;
    className?: string;
    style?: React.CSSProperties;
};

export const NavLink: React.FC<NavLinkProps> = ({ href, exact = false, children, className }) => {
    const pathname = usePathname();
    const isActive = useMemo(
        () => (exact ? pathname === `${href}` : pathname.startsWith(`${href}`)),
        [exact, href, pathname]
    );

    return (
        <Link
            href={href}
            className={cn(
                'flex flex-row items-center gap-2 border-t-4 py-4',
                isActive ? 'border-header-blue' : 'border-white',
                className
            )}
        >
            {children}
        </Link>
    );
};
