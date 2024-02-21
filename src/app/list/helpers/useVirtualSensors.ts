import { useWindowVirtualizer } from '@tanstack/react-virtual';
import { useEffect, useMemo, useRef, useState } from 'react';
import { type RouterOutputs } from '~/trpc/shared';

type UseVirtualSensors = {
    sensors: RouterOutputs['sensor']['infinitySensors']['sensorsWithLocations'];
    hasNextPage?: boolean;
};

export const useVirtualSensors = ({ sensors, hasNextPage }: UseVirtualSensors) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const [isLastItemVisible, setIsLastItemVisible] = useState(false);

    const rows = sensors.length;

    const virtualizerConfig = useMemo(
        () => ({
            count: hasNextPage ? rows + 1 : rows,
            estimateSize: () => 100,
            overscan: 9,
        }),
        [hasNextPage, rows, containerRef.current]
    );

    const virtualizer = useWindowVirtualizer(virtualizerConfig);

    const items = virtualizer.getVirtualItems();

    useEffect(() => {
        if (items.length === 0) return;

        const lastItem = items[items.length - 1];

        if (lastItem) setIsLastItemVisible(lastItem.index >= rows - 1);
    }, [rows, items]);

    return {
        rows,
        virtualizer,
        containerRef,
        items,
        isLastItemVisible,
    };
};
