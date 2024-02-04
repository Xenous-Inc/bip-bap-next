import { z } from 'zod';
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
                latitude: z.number(),
                longitude: z.number(),
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
                    latitude: input.latitude,
                    longitude: input.longitude,
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
            const updatedSensor = await ctx.db.sensor.update({
                where: {
                    id: input.id,
                },
                data: {
                    id: input.id,
                    name: input.name,
                    model: input.model,
                    version: input.version,
                    firmwareVersion: input.firmwareVersion,
                    serialNumber: input.serialNumber,
                    latitude: input.latitude,
                    longitude: input.longitude,
                    ownerId: input.ownerId,
                    values: {
                        update: input.values?.map(sensorData => ({
                            where: {
                                id: sensorData.id,
                            },
                            data: {
                                type: sensorData.type,
                                value: sensorData.value,
                                isDeleted: sensorData.isDeleted,
                            },
                        })),
                    },
                },
                include: {
                    values: true,
                },
            });
            return updatedSensor;
        }),
});
