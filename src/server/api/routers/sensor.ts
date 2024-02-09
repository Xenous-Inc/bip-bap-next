import { z } from 'zod';
import { env } from '~/shared/lib';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const sensorRouter = createTRPCRouter({
    createSensor: publicProcedure
        .input(
            z.object({
                name: z.string(),
                model: z.string().default('default-model'),
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
        const locations = sensors.map(async sensor => {
            const response = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${sensor.longitude},${sensor.latitude}.json?types=address&access_token-${env.NEXT_PUBLIC_MAPBOX_TOKEN}`
            );
            return response.ok ? response.json() : 'Undefined location';
        });

        return { sensors, locations };
    }),
    updateSensor: publicProcedure
        .input(
            z.object({
                id: z.string().cuid(),
                name: z.string(),
                model: z.string(),
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
    getAll: publicProcedure.query(async ({ ctx }) => {
        const allSensors = await ctx.db.sensor.findMany();
        const locationsPromises = allSensors.map(async sensor => {
            const response = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${sensor.longitude},${sensor.latitude}.json?types=address&language=ru&access_token=${env.NEXT_PUBLIC_MAPBOX_TOKEN}`
            );
            if (!response.ok) {
                return 'Udefined location';
            }
            const data = await response.json();
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            const location: string = data.features[0].place_name_ru;
            return location;
        });
        const locations = await Promise.all(locationsPromises);
        const sensorsWithLocations = allSensors.map((sensor, index) => ({
            ...sensor,
            location: locations[index],
        }));

        return sensorsWithLocations;
    }),
    infinitySensors: publicProcedure
        .input(
            z.object({
                limit: z.number().min(1).max(100).nullish(),
                cursor: z.string().nullish(),
            })
        )
        .query(async opts => {
            const { input } = opts;
            const limit = input.limit ?? 50;
            const { cursor } = input;
            const sensors = await opts.ctx.db.sensor.findMany({
                take: limit + 1,
                cursor: cursor ? { id: cursor } : undefined,
                orderBy: {
                    id: 'asc',
                },
            });
            let nextCursor: typeof cursor | undefined = undefined;
            const locationsPromises = sensors.map(async sensor => {
                const response = await fetch(
                    `https://api.mapbox.com/geocoding/v5/mapbox.places/${sensor.longitude},${sensor.latitude}.json?types=address&language=ru&access_token=${env.NEXT_PUBLIC_MAPBOX_TOKEN}`
                );
                if (!response.ok) {
                    return 'Udefined location';
                }
                const data = await response.json();
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                const location: string = data.features[0].place_name_ru;
                return location;
            });
            const locations = await Promise.all(locationsPromises);
            const sensorsWithLocations = sensors.map((sensor, index) => ({
                ...sensor,
                location: locations[index],
            }));
            if (sensorsWithLocations.length > limit) {
                const nextSensor = sensorsWithLocations.pop();
                nextCursor = nextSensor!.id;
            }
            return {
                sensorsWithLocations,
                nextCursor,
            };
        }),
});
