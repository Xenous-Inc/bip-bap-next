import { z } from 'zod';
import {
    type DisplayType,
    DisplayValue,
    type ParametrsType,
    ParametrsValue,
    displayValueSchema,
    paramsValueSchema,
} from '~/entities/FilterMenu';
import { Colors, ValueLimit } from '~/entities/MarkerColor';
import { env } from '~/shared/lib';
import { createTRPCRouter, publicProcedure } from '../trpc';

const Limits = {
    [ParametrsValue.PM25]: 40.5,
    [ParametrsValue.PM10]: 155,
    [ParametrsValue.Ozon]: 0.2,
} as const;

type Values = {
    id: string;
    type: ParametrsType;
    value: number;
    isDeleted: boolean;
    sensorId: string;
};

const getColor = (values: Values[]) => {
    const average = values.reduce((acc, curr) => acc + curr.value, 0) / values.length;
    if (average <= ValueLimit.PERFECT) {
        return { color: Colors.PERFECT, average };
    }
    if (average <= ValueLimit.NORMAL) {
        return { color: Colors.NORMAL, average };
    }
    if (average > ValueLimit.DANGER) {
        return { color: Colors.DANGER, average };
    }
};

const filterByParams = (paramsFilter: Record<ParametrsType, boolean>) => {
    return {
        condition: {
            values: {
                some: {
                    type: {
                        in: Object.entries(paramsFilter)
                            .filter(([, value]) => value)
                            .map(([key]) => key) as ParametrsType[],
                    },
                },
            },
        },
        selectedParams: Object.keys(paramsFilter).filter(
            param => paramsFilter[param as ParametrsType]
        ) as ParametrsType[],
    };
};

const getDisplayCondition = (inputDisplay: DisplayType, selectedParams: ParametrsType[]) => {
    switch (inputDisplay) {
        case DisplayValue.AllSensors: {
            return {};
        }
        case DisplayValue.OutLimit: {
            const OR = selectedParams.map(param => {
                return {
                    values: {
                        some: {
                            type: param,
                            value: {
                                gt: Limits[param],
                            },
                        },
                    },
                };
            });
            return { OR };
        }
        case DisplayValue.TurnOff: {
            return {
                isOnline: false,
            };
        }
    }
};

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
                isOnline: z.boolean().default(true),
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
                    isOnline: input.isOnline,
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
    getByLocation: publicProcedure
        .input(
            z.object({
                location: z.array(z.number()).length(4),
                paramsFilter: z.record(paramsValueSchema, z.boolean()),
                displayFilter: displayValueSchema,
            })
        )
        .query(async ({ ctx, input }) => {
            const paramsModel = filterByParams(input.paramsFilter as Record<ParametrsType, boolean>);
            const sensors = await ctx.db.sensor.findMany({
                include: {
                    values: true,
                },
                where: {
                    latitude: {
                        gte: input.location[1],
                        lte: input.location[3],
                    },
                    longitude: {
                        gte: input.location[0],
                        lte: input.location[2],
                    },
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                    AND: [paramsModel.condition, getDisplayCondition(input.displayFilter, paramsModel.selectedParams)],
                },
            });
            const sensorsWithLocations = await Promise.all(
                sensors.map(async sensor => {
                    const status = getColor(sensor.values);
                    try {
                        const response = await ctx.http.get(
                            `https://api.mapbox.com/geocoding/v5/mapbox.places/${sensor?.longitude},${sensor?.latitude}.json?types=address&language=ru&access_token=${env.NEXT_PUBLIC_MAPBOX_TOKEN}`
                        );

                        if (response.status !== 200) {
                            return { ...sensor, location: 'Undefined location', status: status };
                        }

                        const data = response.data;
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                        const location = data.features[0].place_name_ru;

                        return { ...sensor, location, status: status };
                    } catch (error) {
                        console.error('Error fetching location for sensor:', error);
                        return { ...sensor, location: 'Error fetching location', status: status };
                    }
                })
            );

            return sensorsWithLocations;
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
                isOnline: z.boolean().default(true),
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
                    isOnline: input.isOnline,
                    //ownerId: input.ownerId,
                },
            });
            return updatedSensor;
        }),
    getAll: publicProcedure.query(async ({ ctx }) => {
        const sensors = await ctx.db.sensor.findMany();

        const sensorsWithLocations = await Promise.all(
            sensors.map(async sensor => {
                try {
                    const response = await ctx.http.get(
                        `https://api.mapbox.com/geocoding/v5/mapbox.places/${sensor.longitude},${sensor.latitude}.json?types=address&language=ru&access_token=${env.NEXT_PUBLIC_MAPBOX_TOKEN}`
                    );

                    if (response.status !== 200) {
                        return { ...sensor, location: 'Undefined location' };
                    }

                    const data = response.data;
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                    const location = data.features[0].place_name_ru;

                    return { ...sensor, location };
                } catch (error) {
                    console.error('Error fetching location for sensor:', error);
                    return { ...sensor, location: 'Error fetching location' };
                }
            })
        );

        return sensorsWithLocations;
    }),
    infinitySensors: publicProcedure
        .input(
            z.object({
                limit: z.number().min(1).max(100).nullish(),
                cursor: z.string().nullish(),
                paramsFilter: z.record(paramsValueSchema, z.boolean()),
                displayFilter: displayValueSchema,
            })
        )
        .query(async opts => {
            const { input } = opts;
            const limit = input.limit ?? 50;
            const { cursor } = input;
            const paramsModel = filterByParams(input.paramsFilter as Record<ParametrsType, boolean>);
            const sensors = await opts.ctx.db.sensor.findMany({
                include: {
                    values: true,
                },
                take: limit + 1,
                cursor: cursor ? { id: cursor } : undefined,
                orderBy: {
                    id: 'asc',
                },
                where: {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                    AND: [paramsModel.condition, getDisplayCondition(input.displayFilter, paramsModel.selectedParams)],
                },
            });

            let nextCursor: typeof cursor | undefined = undefined;

            const sensorsWithLocations = await Promise.all(
                sensors.map(async sensor => {
                    try {
                        const response = await opts.ctx.http.get(
                            `https://api.mapbox.com/geocoding/v5/mapbox.places/${sensor?.longitude},${sensor?.latitude}.json?types=address&language=ru&access_token=${env.NEXT_PUBLIC_MAPBOX_TOKEN}`
                        );

                        if (response.status !== 200) {
                            return { ...sensor, location: 'Undefined location' };
                        }

                        const data = await response.data;
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                        const location: string = await data.features[0].place_name_ru;

                        return { ...sensor, location };
                    } catch (error) {
                        console.error('Error fetching location for sensor:', error);
                        return { ...sensor, location: 'Error fetching location' };
                    }
                })
            );
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
