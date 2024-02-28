import { z } from 'zod';
import { DisplayValue, ParametrsValue } from '~/entities/FilterMenu';
import { env } from '~/shared/lib';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { SensorDataType } from './sensorData';

export const DisplayFilterType = ['all-sensors', 'out-limit', 'turn-off-sensors'] as const; // ozon -> 0.2 pm25 -> 40.5 pm10-> 155

const getLimitValue = (type: (typeof SensorDataType)[number]) => {
    switch (type) {
        case ParametrsValue.PM25: {
            return 40.5;
        }
        case ParametrsValue.PM10: {
            return 155;
        }
        case ParametrsValue.Ozon: {
            console.log('OZON');
            return 0.2;
        }
    }
};

const getDisplayCondition = (
    inputDisplay: (typeof DisplayFilterType)[number],
    value: number,
    type: (typeof SensorDataType)[number],
    isOnline: boolean
) => {
    switch (inputDisplay) {
        case DisplayValue.AllSensors: {
            return true;
        }
        case DisplayValue.OutLimit: {
            return value > getLimitValue(type);
        }
        case DisplayValue.TurnOff: {
            return isOnline;
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
                paramsFilter: z.array(z.enum(SensorDataType)).nullish(),
                displayFilter: z.enum(DisplayFilterType),
            })
        )
        .query(async ({ ctx, input }) => {
            const sensors =
                !input.paramsFilter || input.paramsFilter.length === 3
                    ? await ctx.db.sensor.findMany({
                          where: {
                              latitude: {
                                  gte: input.location[1],
                                  lte: input.location[3],
                              },
                              longitude: {
                                  gte: input.location[0],
                                  lte: input.location[2],
                              },
                          },
                      })
                    : await ctx.db.sensor.findMany({
                          where: {
                              latitude: {
                                  gte: input.location[1],
                                  lte: input.location[3],
                              },

                              longitude: {
                                  gte: input.location[0],
                                  lte: input.location[2],
                              },

                              values: {
                                  some: {
                                      OR: [
                                          {
                                              type: input.paramsFilter[0],
                                          },
                                          {
                                              type: input.paramsFilter[1],
                                          },
                                      ],
                                  },
                              },
                          },
                      });

            const SensorWithSensorData = await Promise.all(
                sensors.map(async sensor => {
                    const sensorData = await ctx.db.sensorData.findMany({
                        where: {
                            sensorId: sensor.id,
                        },
                    });
                    return { ...sensor, sensorData: sensorData };
                })
            );

            const filteredSensors = SensorWithSensorData.filter(sensor => {
                const checkGoodSensorData = sensor.sensorData.map(sensorData =>
                    getDisplayCondition(input.displayFilter, sensorData.value, sensorData.type, sensor.isOnline)
                );
                return checkGoodSensorData.includes(true);
            });

            const sensorsWithLocations = await Promise.all(
                filteredSensors.map(async sensor => {
                    try {
                        const response = await ctx.http.get(
                            `https://api.mapbox.com/geocoding/v5/mapbox.places/${sensor?.longitude},${sensor?.latitude}.json?types=address&language=ru&access_token=${env.NEXT_PUBLIC_MAPBOX_TOKEN}`
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
                paramsFilter: z.array(z.enum(SensorDataType)).nullish(),
                displayFilter: z.enum(DisplayFilterType),
            })
        )
        .query(async opts => {
            const { input } = opts;
            const limit = input.limit ?? 50;
            const { cursor } = input;
            const sensors =
                !input.paramsFilter || input.paramsFilter.length === 3
                    ? await opts.ctx.db.sensor.findMany({
                          take: limit + 1,
                          cursor: cursor ? { id: cursor } : undefined,
                          orderBy: {
                              id: 'asc',
                          },
                      })
                    : await opts.ctx.db.sensor.findMany({
                          take: limit + 1,
                          cursor: cursor ? { id: cursor } : undefined,
                          orderBy: {
                              id: 'asc',
                          },
                          where: {
                              values: {
                                  some: {
                                      OR: [
                                          {
                                              type: input.paramsFilter[0],
                                          },
                                          {
                                              type: input.paramsFilter[1],
                                          },
                                      ],
                                  },
                              },
                          },
                      });

            let nextCursor: typeof cursor | undefined = undefined;
            const SensorWithSensorData = await Promise.all(
                sensors.map(async sensor => {
                    const sensorData = await opts.ctx.db.sensorData.findMany({
                        where: {
                            sensorId: sensor.id,
                        },
                    });
                    return { ...sensor, sensorData: sensorData };
                })
            );
            const filteredSensors = SensorWithSensorData.filter(sensor => {
                const checkGoodSensorData = sensor.sensorData.map(sensorData =>
                    getDisplayCondition(input.displayFilter, sensorData.value, sensorData.type, sensor.isOnline)
                );
                return checkGoodSensorData.includes(true);
            });

            const sensorsWithLocations = await Promise.all(
                filteredSensors.map(async sensor => {
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
