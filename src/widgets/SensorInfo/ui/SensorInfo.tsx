'use client';
import { Disclosure } from '@headlessui/react';
import cn from 'classnames';
import { SensorParametr } from '~/entities/SensorParametr';
import { MeasureUnits, ParametrsValue } from '~/entities/SensorParametr/model/constants';
import IconBookmarkWhite from '~/shared/assets/icons/bookmark-white.svg';
import ClockIcon from '~/shared/assets/icons/clock-icon.svg';
import MapButton from '~/shared/assets/icons/map-button.svg';
import PointIcon from '~/shared/assets/icons/map-pin.svg';
import MenuIcon from '~/shared/assets/icons/menu-icon.svg';
import SettingsIcon from '~/shared/assets/icons/settings.svg';
export const SensorInfo: React.FC = () => {
    return (
        <Disclosure>
            <Disclosure.Button
                className={cn(
                    'relative mt-5 flex w-3/4 flex-row items-center  justify-between rounded-md  bg-white ui-open:rounded-b-none'
                )}
            >
                <div className={cn('flex flex-col justify-center gap-y-2 py-3 pl-4')}>
                    <div className={cn('flex  text-black')}>Датчик на Магистральной</div>
                    <div className={cn('flex items-center gap-x-2 text-sm text-lines-color')}>
                        <PointIcon className={cn('h-4 w-4 stroke-current')} />
                        Москва, ул. Независмости 34
                        <MapButton className={cn('h-7 w-7 ui-not-open:hidden')} />
                    </div>
                    <div className={cn('flex items-center gap-x-2 text-sm text-lines-color ui-not-open:hidden')}>
                        <SettingsIcon className={cn('h-4 w-4 stroke-current')} />
                        Модель: Asus k2650
                    </div>
                </div>
                <div className={cn('flex flex-row gap-x-14')}>
                    <div className={cn('flex flex-row gap-x-4 ui-not-open:hidden')}>
                        <button className={cn('btn-filled w-52 items-center justify-center ')}>
                            <ClockIcon className={cn('h-5 w-5')} />
                            Таймлайн
                        </button>
                        <button
                            className={cn('btn-filled w-14  items-center justify-center !bg-btn-green text-white ')}
                        >
                            <IconBookmarkWhite className={cn('h-6 w-6')} />
                        </button>
                    </div>
                    <div className={cn('j mr-4 flex-col items-center space-y-4')}>
                        <div className={cn('ml-1 flex h-2 w-2  rounded-full bg-green-700')}></div>
                        <MenuIcon className={cn('h-4 w-4 ui-not-open:rotate-180')} />
                    </div>
                </div>
            </Disclosure.Button>
            <Disclosure.Panel className={cn('w-3/4  rounded-md rounded-t-none bg-white')}>
                <div className={cn('mx-7 mt-3 h-[1px]  bg-lines-color')}></div>
                <SensorParametr parametr={ParametrsValue.PM10} measureUnit={MeasureUnits.PM10} parametrValue={10} />
                <SensorParametr parametr={ParametrsValue.PM10} measureUnit={MeasureUnits.PM10} parametrValue={10} />
                <SensorParametr parametr={ParametrsValue.PM10} measureUnit={MeasureUnits.PM10} parametrValue={10} />
                <SensorParametr parametr={ParametrsValue.PM10} measureUnit={MeasureUnits.PM10} parametrValue={10} />
            </Disclosure.Panel>
        </Disclosure>
    );
};
