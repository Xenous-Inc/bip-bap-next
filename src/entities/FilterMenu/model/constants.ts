export const DisplayValue = {
    AllSensors: 'all-sensors',
    OutLimit: 'out-limit',
    TurnOff: 'turn-off-sensors',
} as const;

export type DisplayType = (typeof DisplayValue)[keyof typeof DisplayValue];

export const ParametrsValue = {
    PM25: 'pm25',
    PM10: 'pm10',
    Ozon: 'ozon',
} as const;

export type ParametrsType = (typeof ParametrsValue)[keyof typeof ParametrsValue];
