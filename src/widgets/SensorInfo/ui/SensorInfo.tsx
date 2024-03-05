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
import { type RouterOutputs } from '~/trpc/shared';

type SensorInfoType = RouterOutputs['sensor']['getByLocation'][number];

interface SensorInfoProps {
    sensor: SensorInfoType;
}

export const SensorInfo: React.FC<SensorInfoProps> = props => {
    const {
        sensor: { name, model, location, values: sensorData, isOnline },
    } = props;
    return (
        <Disclosure>
            <Disclosure.Button
                className={cn(
                    'relative mt-5 flex  flex-row items-center  justify-between rounded-md  bg-white ui-open:rounded-b-none'
                )}
            >
                <div className={cn('flex flex-col justify-center gap-y-2 py-3 pl-4')}>
                    <div className={cn('flex  text-black')}>{name}</div>
                    <div className={cn('flex items-center gap-x-2 text-sm text-lines-color')}>
                        <PointIcon className={cn('h-4 w-4 stroke-current')} />
                        {location}
                        <MapButton className={cn('h-7 w-7 ui-not-open:hidden')} />
                    </div>
                    <div className={cn('flex items-center gap-x-2 text-sm text-lines-color ui-not-open:hidden')}>
                        <SettingsIcon className={cn('h-4 w-4 stroke-current')} />
                        Модель: {model}
                    </div>
                </div>
                <div className={cn('flex flex-row gap-x-14')}>
                    <div className={cn('flex flex-row gap-x-4 ui-not-open:hidden')}>
                        <button className={cn('btn-filled w-52 items-center justify-center !bg-green-700')}>
                            <ClockIcon className={cn('h-5 w-5')} />
                            Таймлайн
                        </button>
                        <button className={cn('btn-filled w-14  items-center justify-center  text-white')}>
                            <IconBookmarkWhite className={cn('h-6 w-6')} />
                        </button>
                    </div>
                    <div className={cn('j mr-4 flex-col items-center space-y-4')}>
                        <div
                            className={cn('ml-1 flex h-2 w-2  rounded-full', isOnline ? 'bg-green-700' : 'bg-red-700')}
                        ></div>
                        <MenuIcon className={cn('h-4 w-4 ui-not-open:rotate-180')} />
                    </div>
                </div>
            </Disclosure.Button>
            <Disclosure.Panel className={cn('rounded-md rounded-t-none bg-white')}>
                <div className={cn('mx-7 mt-3 h-[1px]  bg-lines-color')}></div>
                {sensorData.map(el => {
                    return (
                        <SensorParametr
                            parametr={ParametrsValue[el.type]}
                            measureUnit={MeasureUnits[el.type]}
                            parametrValue={el.value}
                        />
                    );
                })}
            </Disclosure.Panel>
        </Disclosure>
    );
};
