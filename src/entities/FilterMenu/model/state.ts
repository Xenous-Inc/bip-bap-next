'use client';
import { atomWithSessionStorage } from '~/shared/lib/hooks';
import { type ParametrsType, initialDisplay, initialParams } from './constants';

export const filterStateAtom = atomWithSessionStorage('FILTER_STATE', {
    params: initialParams,
    display: initialDisplay,
});

export const stringify = (params: Record<ParametrsType, boolean>): ParametrsType[] => {
    return Object.keys(params).filter(param => params[param as ParametrsType]) as ParametrsType[];
};
