import { type Params } from '~/shared/lib/hooks/searchState/useSearchState';

export const Layer = {
    Gradient: 'gradient',
    Sensors: 'sensors',
} as const;

export const SensorsLayer: Params = {
    // eslint-disable-next-line prettier/prettier
    'layer': Layer.Sensors,
} as const;

export const GradientLayer: Params = {
    // eslint-disable-next-line prettier/prettier
    'layer': Layer.Gradient,
} as const;

export type LayerType = (typeof Layer)[keyof typeof Layer];
