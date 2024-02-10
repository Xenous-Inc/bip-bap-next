'use client';
import cn from 'classnames';
import { useEffect, useMemo, useState } from 'react';
import { FilterMenuButton } from '~/features/FilterMenuButton/ui/FilterMenuButton';
import IconList from '~/shared/assets/icons/icon_list.svg';
import { api } from '~/trpc/react';
import { FilterMenu } from '~/widgets/FilterMenu';
import { SensorInfo } from '~/widgets/SensorInfo';
import { useVirtualSensors } from './helpers/useVirtualSensors';

export default () => {
    const [isOpenFilterMenu, setIsOpenFilterMenu] = useState(false);
    const { hasNextPage, data, fetchNextPage, isFetchingNextPage, isLoading } =
        api.sensor.infinitySensors.useInfiniteQuery(
            {
                limit: 13,
            },
            {
                getNextPageParam: lastPage => lastPage.nextCursor,
            }
        );

    const sensors = useMemo(() => {
        if (!data) return [];
        return data.pages.flatMap(page => page.sensorsWithLocations ?? []);
    }, [data]);

    const { containerRef, rows, items, virtualizer, isLastItemVisible } = useVirtualSensors({
        sensors,
        hasNextPage,
    });

    useEffect(() => {
        if (isLastItemVisible && hasNextPage && !isFetchingNextPage) {
            void fetchNextPage();
        }
    }, [isLastItemVisible, hasNextPage, isFetchingNextPage]);
    return (
        <main className={'relative flex max-h-screen min-h-screen w-screen flex-col bg-page-bg '}>
            <FilterMenu isOpen={isOpenFilterMenu} setIsOpen={setIsOpenFilterMenu} />
            <div className={'relative flex w-full flex-row justify-between bg-page-bg px-32 pb-3 pt-20'}>
                <div className={'flex flex-row gap-x-2 '}>
                    <IconList className={'h-6 w-6'} />
                    <p> Список датчиков</p>
                </div>

                <FilterMenuButton
                    isOpen={isOpenFilterMenu}
                    setIsOpen={setIsOpenFilterMenu}
                    styledPosition={'top-20 right-10'}
                />
            </div>
            {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                !isLoading && items.length === 0 && <div>Датчков нет</div>
            }
            <div
                ref={containerRef}
                className={'container relative w-full items-center px-32'}
                style={{ height: `${virtualizer.getTotalSize()}px` }}
            >
                <div className={'flex w-full flex-col '}>
                    {items.map(virtualRow => {
                        const isLoaderRow = virtualRow.index > rows - 1;
                        const rowProducts = sensors.slice(virtualRow.index, virtualRow.index + 1);

                        if (isLoaderRow)
                            return (
                                <div
                                    key={virtualRow.index}
                                    data-index={virtualRow.index}
                                    ref={virtualizer.measureElement}
                                    className={'rounded-6 border-1.5 border-primary bg-productname w-full py-3'}
                                >
                                    <span className={'text-14 font-600 line-clamp-1 w-full text-center text-black'}>
                                        Загрузка
                                    </span>
                                </div>
                            );

                        return (
                            <div
                                key={virtualRow.index}
                                data-index={virtualRow.index}
                                ref={virtualizer.measureElement}
                                className={'flex w-full flex-col gap-y-2'}
                            >
                                {rowProducts.map(sensor => (
                                    <SensorInfo sensor={sensor} location={sensor.location} />
                                ))}
                            </div>
                        );
                    })}
                </div>
            </div>
        </main>
    );
};
