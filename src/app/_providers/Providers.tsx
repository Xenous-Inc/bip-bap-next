import { AuthProvider } from './AuthProvider';
import { TRPCProvider } from './TRPCProvider';

export const Providers: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <AuthProvider>
            <TRPCProvider>{children}</TRPCProvider>
        </AuthProvider>
    );
};
