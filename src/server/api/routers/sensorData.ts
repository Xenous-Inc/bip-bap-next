import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';

const SensorDataType = ['PM10', 'PM25', 'OZON'] as const;

export const sensorDataRouter = createTRPCRouter({
    createSensorData: publicProcedure
        .input(
            z
                .object({
                    type: z.enum(SensorDataType),
                    value: z.number(),
                    isDeleted: z.boolean(),
                    sensorId: z.string().cuid(),
                })
                .default({
                    type: SensorDataType[0],
                    value: 10,
                    isDeleted: false,
                    sensorId: '',
                })
        )
        .mutation(async ({ ctx, input }) => {
            const newSensorData = await ctx.db.sensorData.create({
                data: {
                    type: input.type,
                    value: input.value,
                    isDeleted: input.isDeleted,
                    sensorId: input.sensorId,
                },
            });
            return newSensorData;
        }),
    deleteSensorData: publicProcedure.input(z.string().cuid()).mutation(async ({ ctx, input }) => {
        const deletedSensor = await ctx.db.sensorData.delete({
            where: {
                id: input,
            },
        });
        return deletedSensor;
    }),
    getBySensorId: publicProcedure.input(z.string().cuid()).query(async ({ ctx, input }) => {
        const sensorDataArray = await ctx.db.sensorData.findMany({
            where: {
                sensorId: input,
            },
        });
        return sensorDataArray;
    }),
    updateSensorData: publicProcedure
        .input(
            z.object({
                id: z.string().cuid(),
                type: z.enum(SensorDataType),
                value: z.number(),
                isDeleted: z.boolean(),
                sensorId: z.string().cuid(),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const updatedSensorData = await ctx.db.sensorData.update({
                where: {
                    id: input.id,
                },
                data: {
                    type: input.type,
                    value: input.value,
                    isDeleted: input.isDeleted,
                },
            });
            return updatedSensorData;
        }),
});
