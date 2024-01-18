import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { type NextRequest } from 'next/server';
import { createTRPCContext, appRouter } from '~/server';
import { env } from '~/shared/lib';

const createContext = async (req: NextRequest) => {
    return createTRPCContext({
        headers: req.headers,
    });
};

const handler = (req: NextRequest) =>
    fetchRequestHandler({
        endpoint: '/api/trpc',
        req,
        router: appRouter,
        createContext: () => createContext(req),
        onError:
            env.NEXT_PUBLIC_ENV === 'development'
                ? ({ path, error }) => {
                      console.error(`❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`);
                  }
                : undefined,
    });

export { handler as GET, handler as POST };
