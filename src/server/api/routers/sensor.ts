import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const sensorRouter = createTRPCRouter({
    createSensor: publicProcedure
        .input(
            z.object({
                name: z.string(),
                model: z.number().default(1),
                version: z.number().default(1.1),
                firmwareVersion: z.string().default('default-firmwareVersion'),
                serialNumber: z.string().default('default-serialNumber'),
                latitude: z.number(),
                longitude: z.number(),
                //ownerId: z.string().cuid().default('cklns1fzi0000lflw9p2wx7az'),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const newSensor = await ctx.db.sensor.create({
                data: {
                    name: input.name,
                    model: input.model,
                    version: input.version,
                    firmwareVersion: input.firmwareVersion,
                    serialNumber: input.serialNumber,
                    latitude: input.latitude,
                    longitude: input.longitude,
                    //ownerId: 'cklns1fzi0000lflw9p2wx7az',
                },
            });
            return newSensor;
        }),
    deleteSensor: publicProcedure.input(z.string().cuid()).mutation(async ({ ctx, input }) => {
        const deletedSensor = await ctx.db.sensor.delete({
            where: {
                id: input,
            },
        });
        return deletedSensor;
    }),
    getByLocation: publicProcedure.input(z.array(z.number()).length(4)).query(async ({ ctx, input }) => {
        const sensors = await ctx.db.sensor.findMany({
            where: {
                latitude: {
                    gte: input[1],
                    lte: input[3],
                },
                longitude: {
                    gte: input[0],
                    lte: input[2],
                },
            },
        });
        return { sensors };
    }),
    updateSensor: publicProcedure
        .input(
            z.object({
                id: z.string().cuid(),
                name: z.string(),
                model: z.number(),
                version: z.number(),
                firmwareVersion: z.string(),
                serialNumber: z.string(),
                latitude: z.number(),
                longitude: z.number(),
                // ownerId: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const updatedSensor = await ctx.db.sensor.update({
                where: {
                    id: input.id,
                },
                data: {
                    name: input.name,
                    model: input.model,
                    version: input.version,
                    firmwareVersion: input.firmwareVersion,
                    serialNumber: input.serialNumber,
                    latitude: input.latitude,
                    longitude: input.longitude,
                    //ownerId: input.ownerId,
                },
            });
            return updatedSensor;
        }),
});
