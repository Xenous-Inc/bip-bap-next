import { postRouter } from '~/server/api/routers/post';
import { createTRPCRouter } from '~/server/api/trpc';
import { sensorRouter } from './routers/sensor';

export const appRouter = createTRPCRouter({
    post: postRouter,
    sensor: sensorRouter,
});

export type AppRouter = typeof appRouter;
