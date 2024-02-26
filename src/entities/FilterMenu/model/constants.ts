export const DisplayValue = {
    AllSensors: 'all-sensors',
    OutLimit: 'out-limit',
    TurnOff: 'turn-off-sensors',
} as const;

export type DisplayType = (typeof DisplayValue)[keyof typeof DisplayValue];

export const ParametrsValue = {
    PM25: 'PM25',
    PM10: 'PM10',
    Ozon: 'OZON',
} as const;

export type ParametrsType = (typeof ParametrsValue)[keyof typeof ParametrsValue];

export const initialParams: Record<ParametrsType, boolean> = {
    [ParametrsValue.PM25]: true,
    [ParametrsValue.PM10]: true,
    [ParametrsValue.Ozon]: true,
};

export const initialDisplay: DisplayType = DisplayValue.AllSensors;
