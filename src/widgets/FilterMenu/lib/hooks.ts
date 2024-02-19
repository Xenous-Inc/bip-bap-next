'use client';
import { useCallback, useEffect, useState } from 'react';
import { ParametrsValue, type ParametrsType, DisplayValue } from '~/entities/FilterMenu';
import { useSearchState } from '~/shared/lib';

// parse query string to  Parametrs object
const parse = (query: string) => {
    console.log(query);
    const values = query.split('+');
    return Object.values(ParametrsValue).reduce(
        (acc, parametr) => {
            acc[parametr] = values.includes(parametr);
            return acc;
            // eslint-disable-next-line @typescript-eslint/prefer-reduce-type-parameter
        },
        {} as Record<ParametrsType, boolean>
    );
};

const stringify = (params: Record<ParametrsType, boolean>) => {
    return Object.keys(params)
        .filter(param => params[param as ParametrsType])
        .join('+');
};
const InitialParams: Record<ParametrsType, boolean> = {
    pm10: true,
    pm25: true,
    ozon: true,
};

export const useSideSheetState = () => {
    const searchState = useSearchState({ params: stringify(InitialParams), display: DisplayValue.AllSensors });
    const params = searchState.get().params;
    const parseParams = parse(params ?? '');
    const [selectedParams, setSelectedParams] = useState<Record<ParametrsType, boolean>>(InitialParams);
    const display = searchState.get().display;
    const [selectedDisplay, setSelectedDisplay] = useState(display ?? DisplayValue.AllSensors);
    const [isAllChecked, setIsAllChecked] = useState(true);

    useEffect(() => {
        setIsAllChecked(!Object.values(selectedParams).includes(false));
    }, [selectedParams]);

    const toggleParamsState = (value: ParametrsType | ParametrsType[]) => {
        if (Array.isArray(value)) {
            setSelectedParams(prev => {
                return Object.assign(
                    prev,
                    value.reduce(
                        (acc, param: ParametrsType) => {
                            acc[param] = !isAllChecked;
                            return acc;
                            // eslint-disable-next-line @typescript-eslint/prefer-reduce-type-parameter
                        },
                        {} as Record<ParametrsType, boolean>
                    )
                );
            });
            return;
        }
        setSelectedParams(prev => ({ ...prev, [value]: !prev[value] }));
    };

    const toggleDisplayState = (value: string) => {
        setSelectedDisplay(value);
    };
    const setState = useCallback(() => {
        const stringifyParams = stringify(selectedParams);
        searchState.set({ params: stringifyParams, display: selectedDisplay });
    }, [selectedParams, selectedDisplay]);
    return {
        params,
        display,
        toggleDisplayState,
        toggleParamsState,
        setState,
        selectedParams,
        selectedDisplay,
        isAllChecked,
        setIsAllChecked,
    };
};
