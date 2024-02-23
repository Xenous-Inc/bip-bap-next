'use client';
import { atom } from 'jotai';
import { type DisplayType, type ParametrsType } from '~/entities/FilterMenu';
import { type LayerType } from '~/entities/LayerPicker/model/constants';
import { type EnumType } from '../../types';

export const SessionKey = {
    FILTER_STATE: 'FILTER_STATE',
    LAYER_STATE: 'LAYER_STATE',
} as const;

export type SessionValue = {
    [SessionKey.FILTER_STATE]: {
        params: Record<ParametrsType, boolean>;
        display: DisplayType;
    };
    [SessionKey.LAYER_STATE]: {
        layer: LayerType;
    };
};

type SessionKeyType = EnumType<typeof SessionKey>;

export const atomWithSessionStorage = <K extends SessionKeyType>(key: K, initialValue: SessionValue[K]) => {
    const getInitialValue = () => {
        const item = typeof window !== 'undefined' ? sessionStorage?.getItem(key) : null;

        if (item !== null) {
            return JSON.parse(item) as SessionValue[typeof key];
        }
        return initialValue;
    };
    const baseAtom = atom(getInitialValue());
    const derivedAtom = atom(
        get => get(baseAtom),
        (
            get,
            set,
            update: SessionValue[typeof key] | ((prev: SessionValue[typeof key]) => SessionValue[typeof key])
        ) => {
            const nextValue = typeof update === 'function' ? update(get(baseAtom)) : update;
            set(baseAtom, nextValue);
            typeof window !== 'undefined' && sessionStorage?.setItem(key, JSON.stringify(nextValue));
        }
    );
    return derivedAtom;
};
