import { postRouter } from '~/server/api/routers/post';
import { createTRPCRouter } from '~/server/api/trpc';
import { sensorRouter } from './routers/sensor';
import { sensorDataRouter } from './routers/sensorData';
import { userRouter } from './routers/user';

export const appRouter = createTRPCRouter({
    post: postRouter,
    sensor: sensorRouter,
    sensorData: sensorDataRouter,
    user: userRouter,
});

export type AppRouter = typeof appRouter;
