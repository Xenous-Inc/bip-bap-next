import { atomWithSessionStorage } from '~/shared/lib/hooks';
import { Layer } from './constants';

export const LayerStateAtom = atomWithSessionStorage('LAYER_STATE', { layer: Layer.Sensors });
