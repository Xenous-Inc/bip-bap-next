export const ParametrsValue = {
    PM25: 'PM 2.5',
    PM10: 'PM 10',
    Ozon: 'Озон',
} as const;

export type ParametrsType = (typeof ParametrsValue)[keyof typeof ParametrsValue];

export const MeasureUnits = {
    PM25: { normalValue: '25', units: 'мкг/м. куб.' },
    PM10: { normalValue: '50', units: ' мкг/м. куб.' },
    Ozon: { normalValue: '0.16 ', units: 'мг/м. куб.' },
} as const;

export type MeasureUnitsType = (typeof MeasureUnits)[keyof typeof MeasureUnits];
