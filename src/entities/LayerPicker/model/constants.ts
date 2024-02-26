export const Layer = {
    Gradient: 'gradient',
    Sensors: 'sensors',
} as const;

export const SensorsLayer = {
    layer: Layer.Sensors,
} as const;

export const GradientLayer = {
    layer: Layer.Gradient,
} as const;

export type LayerType = (typeof Layer)[keyof typeof Layer];
