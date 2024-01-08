import { cookies } from 'next/headers';
import { TRPCReactProvider } from '~/trpc/react';

export const TRPCProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    return <TRPCReactProvider cookies={cookies().toString()}>{children}</TRPCReactProvider>;
};
