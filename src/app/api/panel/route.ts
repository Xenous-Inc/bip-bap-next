import { NextResponse } from 'next/server';
import { renderTrpcPanel } from 'trpc-panel';
import { appRouter } from '~/server/api/root';

export const GET = async () => {
    return new NextResponse(
        renderTrpcPanel(appRouter, {
            url: 'http://localhost:3000/api/trpc',
            transformer: 'superjson',
        }),
        { status: 200, headers: [['Content-Type', 'text/html'] as [string, string]] }
    );
};
