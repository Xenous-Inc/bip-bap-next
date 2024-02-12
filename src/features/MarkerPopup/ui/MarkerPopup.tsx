'use client';

import cn from 'classnames';
import { Popup, type PopupProps } from '~/entities/Popup';
import { SensorParametr } from '~/entities/SensorParametr';
import { MeasureUnits, ParametrsValue } from '~/entities/SensorParametr/model/constants';
import IconBookmarkWhite from '~/shared/assets/icons/bookmark-white.svg';
import ClockIcon from '~/shared/assets/icons/clock-icon.svg';
import MapButton from '~/shared/assets/icons/map-button.svg';
import PointIcon from '~/shared/assets/icons/map-pin.svg';
import MenuIcon from '~/shared/assets/icons/menu-icon.svg';
import SettingsIcon from '~/shared/assets/icons/settings.svg';
import { api } from '~/trpc/react';

interface MarkerPopupProps {
    sensor: {
        id: string;
        name: string;
        model: string;
        version: number;
        firmwareVersion: string;
        serialNumber: string;
        latitude: number;
        longitude: number;
        location: string;
    };
}

export const MarkerPopup: React.FC<MarkerPopupProps> = props => {
    const { sensor } = props;
    const sensorDataResponse = api.sensorData.getBySensorId.useQuery(sensor.id);
    if (sensorDataResponse.isSuccess)
        return (
            <div>
                <div className={cn('flex flex-col justify-center gap-y-2 py-3 pl-4')}>
                    <div className={cn('flex  text-black')}>{sensor.name}</div>
                    <div className={cn('flex items-center gap-x-2 text-sm text-lines-color')}>
                        <PointIcon className={cn('h-4 w-4 stroke-current')} />
                        {sensor.location}
                        <MapButton className={cn('h-7 w-7 ui-not-open:hidden')} />
                    </div>
                    <div className={cn('flex items-center gap-x-2 text-sm text-lines-color ui-not-open:hidden')}>
                        <SettingsIcon className={cn('h-4 w-4 stroke-current')} />
                        Модель: {sensor.model}
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
                {sensorDataResponse.data.map(sensorData => {
                    return (
                        <SensorParametr
                            parametr={ParametrsValue[sensorData.type]}
                            measureUnit={MeasureUnits[sensorData.type]}
                            parametrValue={sensorData.value}
                        />
                    );
                })}
            </div>
        );
};
