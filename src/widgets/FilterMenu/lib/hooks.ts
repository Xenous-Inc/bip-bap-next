import { useCallback, useEffect, useState } from 'react';
import { ParametrsValue, type ParametrsType, DisplayValue } from '~/entities/FilterMenu';
import { useSearchState } from '~/shared/lib';
import { useSessionStorageState } from '~/shared/lib/hooks/sessionStorage/useSessionStorage';

// parse query string to  Parametrs object
const parse = (query: string) => {
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
export const useSideSheetState = () => {
    const sessionState = useSessionStorageState();
    const params = sessionState.get().params;
    const parseParams = parse(params ?? 'pm25+pm10+ozon');
    const [selectedParams, setSelectedParams] = useState<Record<ParametrsType, boolean>>(parseParams);
    const display = sessionState.get().display;
    const [selectedDisplay, setSelectedDisplay] = useState(display ?? DisplayValue.AllSensors);
    const [isAllChecked, setIsAllChecked] = useState(false);

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
        sessionState.set({ params: stringifyParams });
        sessionState.set({ display: selectedDisplay });
        console.log('APPLY');
        console.log('PARAMS');
        console.log(sessionStorage);
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
