'use client';

import { Disclosure } from '@headlessui/react';
import cn from 'classnames';
import { DisplayValue, ParametrsValue, useSideSheetState } from '~/entities/FilterMenu';
import { SideSheet } from '~/entities/SideSheet';
import FilterIcon from '~/shared/assets/icons/filter.svg';
import IconClose from '~/shared/assets/icons/icon_close.svg';
import MenuIcon from '~/shared/assets/icons/menu-icon.svg';
import Sliders from '~/shared/assets/icons/sliders.svg';
import TrashIcon from '~/shared/assets/icons/trash-2.svg';

interface FilterMenuProps {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
}

export const FilterMenu: React.FC<FilterMenuProps> = props => {
    const { isOpen, setIsOpen } = props;

    const {
        toggleDisplayState,
        toggleParamsState,
        setState,
        selectedDisplay,
        selectedParams,
        isAllChecked,
        setIsAllChecked,
        clearState,
    } = useSideSheetState();

    return (
        <SideSheet isOpen={isOpen} setIsOpen={setIsOpen}>
            <div className={cn('flex flex-col gap-y-5')}>
                <div className={cn('flex flex-row items-center justify-between')}>
                    <div className={cn('flex flex-row items-center justify-center gap-x-2')}>
                        <Sliders width='14' height='14' />
                        Фильтры
                    </div>
                    <button onClick={() => setIsOpen(false)}>
                        <IconClose className={cn('h-6 w-6')} />
                    </button>
                </div>
                <Disclosure>
                    <Disclosure.Button className={cn('relative mt-5 flex flex-row items-center justify-between')}>
                        Параметры
                        <MenuIcon className={cn('h-4 w-4 ui-not-open:rotate-180')} />
                    </Disclosure.Button>
                    <Disclosure.Panel>
                        <label htmlFor='all' className={cn('my-4 flex flex-row gap-x-1 overflow-hidden')}>
                            <input
                                type='checkbox'
                                id='all'
                                className={cn('checkbox')}
                                onChange={() => {
                                    setIsAllChecked(!isAllChecked);
                                    toggleParamsState([ParametrsValue.PM25, ParametrsValue.PM10, ParametrsValue.Ozon]);
                                }}
                                checked={isAllChecked}
                            />
                            Все
                        </label>
                        <label htmlFor='pm25' className={cn('my-4 flex flex-row gap-x-1 overflow-hidden')}>
                            <input
                                type='checkbox'
                                id='pm25'
                                className={cn('checkbox')}
                                onChange={() => {
                                    toggleParamsState(ParametrsValue.PM25);
                                }}
                                checked={selectedParams[ParametrsValue.PM25]}
                            />
                            PM 2.5
                        </label>
                        <label htmlFor='pm10' className={cn('my-4 flex flex-row gap-x-1 overflow-hidden')}>
                            <input
                                type='checkbox'
                                id='pm10'
                                className={cn('checkbox')}
                                onChange={() => {
                                    toggleParamsState(ParametrsValue.PM10);
                                }}
                                checked={selectedParams[ParametrsValue.PM10]}
                            />
                            PM 10
                        </label>
                        <label htmlFor='ozon' className={cn('flex flex-row gap-x-1 overflow-hidden')}>
                            <input
                                type='checkbox'
                                id='ozon'
                                className={cn('checkbox')}
                                onChange={() => {
                                    toggleParamsState(ParametrsValue.Ozon);
                                }}
                                checked={selectedParams[ParametrsValue.Ozon]}
                            />
                            Озон
                        </label>
                    </Disclosure.Panel>
                </Disclosure>
                <Disclosure>
                    <Disclosure.Button className={cn('relative mt-5 flex flex-row items-center justify-between')}>
                        Отображение
                        <MenuIcon className={cn('h-4 w-4 ui-not-open:rotate-180')} />
                    </Disclosure.Button>
                    <Disclosure.Panel>
                        <label htmlFor='all-sensors' className={cn('my-4 flex flex-row gap-x-1 overflow-hidden')}>
                            <input
                                type='radio'
                                id='all-sensors'
                                name='display'
                                className={cn('radiobutton')}
                                defaultChecked={selectedDisplay === DisplayValue.AllSensors}
                                onChange={() => {
                                    toggleDisplayState(DisplayValue.AllSensors);
                                }}
                            />
                            Все датчики
                        </label>
                        <label htmlFor='out-limit' className={cn('my-4 flex flex-row gap-x-1 overflow-hidden')}>
                            <input
                                type='radio'
                                id='out-limit'
                                name='display'
                                className={cn('radiobutton')}
                                onChange={() => {
                                    toggleDisplayState(DisplayValue.OutLimit);
                                }}
                                defaultChecked={selectedDisplay === DisplayValue.OutLimit}
                            />
                            Превышающие нормы
                        </label>
                        <label htmlFor='turn-off' className={cn('my-4 flex flex-row gap-x-1 overflow-hidden')}>
                            <input
                                type='radio'
                                name='display'
                                id='turn-off'
                                className={cn('radiobutton')}
                                onChange={() => {
                                    toggleDisplayState(DisplayValue.TurnOff);
                                }}
                                defaultChecked={selectedDisplay === DisplayValue.TurnOff}
                            />
                            Отключение датчиков
                        </label>
                    </Disclosure.Panel>
                </Disclosure>
            </div>
            <div className={'flex grow flex-col items-center justify-end gap-y-2'}>
                <button
                    className={cn(
                        'btn-outlined active:btn-filled flex w-full items-center justify-center duration-100'
                    )}
                    onClick={() => {
                        setState();
                    }}
                >
                    <FilterIcon className={cn('h-6 w-6')} /> Показать
                </button>
                <button
                    className={cn(
                        'btn-blank active:btn-outlined flex w-full items-center justify-center gap-x-2  active:!border-lines-color '
                    )}
                    onClick={() => {
                        clearState();
                    }}
                >
                    <TrashIcon className={cn('h-4 w-4')} /> Сброс
                </button>
            </div>
        </SideSheet>
    );
};
