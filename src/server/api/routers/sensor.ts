import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';

const SensorDataType = ['PM10', 'PM25', 'OZON'] as const;

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
                ownerId: z.string(),
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
                    ownerId: input.ownerId,
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
    getByLocation: publicProcedure
        .input(z.object({ latitude: z.number(), longitude: z.number() }))
        .query(async ({ ctx, input }) => {
            const sensors = await ctx.db.sensor.findMany({
                where: {
                    latitude: input.latitude,
                    longitude: input.longitude,
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
                ownerId: z.string(),
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
                    ownerId: input.ownerId,
                },
            });
            return updatedSensor;
        }),
});
