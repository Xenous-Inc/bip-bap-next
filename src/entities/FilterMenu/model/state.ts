import { atomWithSessionStorage } from '~/shared/lib/hooks';
import { initialDisplay, initialParams } from './constants';

export const filterStateAtom = atomWithSessionStorage('FILTER_STATE', {
    params: initialParams,
    display: initialDisplay,
});
