'use client';
import { useAtom } from 'jotai';
import { useCallback, useEffect, useState } from 'react';
import { type ParametrsType, type DisplayType } from '~/entities/FilterMenu';
import { initialDisplay, initialParams } from './constants';
import { filterStateAtom } from './state';

export const useSideSheetState = () => {
    const [filterState, setFilterState] = useAtom(filterStateAtom);

    const [selectedParams, setSelectedParams] = useState<Record<ParametrsType, boolean>>(filterState.params);

    const [selectedDisplay, setSelectedDisplay] = useState<DisplayType>(filterState.display);

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

    const toggleDisplayState = (value: DisplayType) => {
        setSelectedDisplay(value);
    };
    const setState = useCallback(() => {
        setFilterState({ params: selectedParams, display: selectedDisplay });
    }, [selectedParams, selectedDisplay]);

    const clearState = useCallback(() => {
        setSelectedDisplay(initialDisplay);
        setSelectedParams(initialParams);
        setFilterState({ params: selectedParams, display: selectedDisplay });
    }, [selectedParams, selectedDisplay]);
    return {
        toggleDisplayState,
        toggleParamsState,
        setState,
        selectedParams,
        selectedDisplay,
        isAllChecked,
        setIsAllChecked,
        clearState,
    };
};
