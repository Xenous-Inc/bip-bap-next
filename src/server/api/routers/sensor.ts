import { number, z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';

const SensorDataType = ['PM10', 'PM25', 'OZON'] as const;

export const sensorRouter = createTRPCRouter({
    createSensor: publicProcedure
        .input(
            z.object({
                id: z.string().cuid(),
                name: z.string(),
                model: z.number(),
                version: z.number(),
                firmwareVersion: z.string(),
                serialNumber: z.string(),
                coordinates: z.array(z.number()),
                values: z.array(
                    z.object({
                        id: z.string().cuid(),
                        type: z.enum(SensorDataType),
                        value: z.number(),
                        isDeleted: z.boolean(),
                    })
                ),
                ownerId: z.string(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const newSensor = await ctx.db.sensor.create({
                data: {
                    id: input.id,
                    name: input.name,
                    model: input.model,
                    version: input.version,
                    firmwareVersion: input.firmwareVersion,
                    serialNumber: input.serialNumber,
                    coordinates: input.coordinates,
                    ownerId: input.ownerId,
                    values: {
                        create: input.values,
                    },
                },
                include: {
                    values: true,
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
});
