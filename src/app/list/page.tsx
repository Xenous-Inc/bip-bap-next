'use client';
import cn from 'classnames';
import { useAtomValue } from 'jotai';
import { useEffect, useMemo, useState } from 'react';
import { filterStateAtom } from '~/entities/FilterMenu';
import { FilterMenuButton } from '~/features/FilterMenuButton/ui/FilterMenuButton';
import IconList from '~/shared/assets/icons/icon_list.svg';
import { api } from '~/trpc/react';
import { FilterMenu } from '~/widgets/FilterMenu';
import { SensorInfo } from '~/widgets/SensorInfo';
import { useVirtualSensors } from './helpers/useVirtualSensors';

export default () => {
    const [isOpenFilterMenu, setIsOpenFilterMenu] = useState(false);

    const filterState = useAtomValue(filterStateAtom);

    const params = filterState.params;
    const display = filterState.display;

    const { hasNextPage, data, fetchNextPage, isFetchingNextPage, isLoading } =
        api.sensor.infinitySensors.useInfiniteQuery(
            {
                limit: 9,
                paramsFilter: params,
                displayFilter: display,
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
        <main className={'relative flex min-h-screen w-full flex-col bg-page-bg pt-24'}>
            <FilterMenu isOpen={isOpenFilterMenu} setIsOpen={setIsOpenFilterMenu} />
            <div className={' flex w-full flex-row justify-between bg-page-bg px-32 pb-4 pt-2'}>
                <div className={'flex flex-row gap-x-2 '}>
                    <IconList className={'h-6 w-6'} />
                    <p className={'text-lg'}> Список датчиков</p>
                </div>

                <FilterMenuButton
                    isOpen={isOpenFilterMenu}
                    setIsOpen={setIsOpenFilterMenu}
                    styledPosition={'right-10'}
                />
            </div>
            {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                !isLoading && items.length === 0 && <p>Датчков нет</p>
            }
            <div ref={containerRef} className={cn(' bg-page-bg pl-32 pr-10', `h-[${virtualizer.getTotalSize()}px]`)}>
                <div className={''}>
                    {items.map(virtualRow => {
                        const isLoaderRow = virtualRow.index > rows - 1;
                        const rowSensors = sensors.slice(virtualRow.index, virtualRow.index + 1);

                        if (isLoaderRow)
                            return (
                                <div
                                    key={virtualRow.index}
                                    data-index={virtualRow.index}
                                    ref={virtualizer.measureElement}
                                    className={'bg-productname w-full py-3'}
                                >
                                    <span className={'line-clamp-1 w-full text-center text-black'}>Загрузка</span>
                                </div>
                            );
                        if (hasNextPage) {
                            <p>Датчков нет</p>;
                        }

                        return (
                            <div
                                key={virtualRow.index}
                                data-index={virtualRow.index}
                                ref={virtualizer.measureElement}
                                className={'flex w-full flex-col'}
                            >
                                {rowSensors.map(sensor => (
                                    <SensorInfo sensor={sensor} />
                                ))}
                            </div>
                        );
                    })}
                </div>
            </div>
        </main>
    );
};
