import { postRouter } from '~/server/api/routers/post';
import { createTRPCRouter } from '~/server/api/trpc';
import { sensorRouter } from './routers/sensor';
import { sensorDataRouter } from './routers/sensorData';

export const appRouter = createTRPCRouter({
    post: postRouter,
    sensor: sensorRouter,
    sensorData: sensorDataRouter,
});

export type AppRouter = typeof appRouter;
