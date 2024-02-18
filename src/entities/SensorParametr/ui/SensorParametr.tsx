import cn from 'classnames';
import { type MeasureUnitsType, type ParametrsType } from '../model/constants';

interface SensorParametrProps {
    parametr: ParametrsType;
    measureUnit: MeasureUnitsType;
    parametrValue: number;
}

export const SensorParametr: React.FC<SensorParametrProps> = props => {
    const {
        parametr,
        measureUnit: { normalValue: normalValue, units: units },
        parametrValue,
    } = props;
    return (
        <div className={cn('flex h-full   w-96 flex-row justify-between px-7 py-2 text-black')}>
            <div className={cn('flex flex-col gap-y-1')}>
                <p className={cn('')}>{parametr}</p>
                <p className={cn('text-sm text-btn-green')}>{normalValue + units}</p>
            </div>
            <div className={cn('flex flex-row items-center justify-center gap-x-2')}>
                <div>{parametrValue + units}</div>
                <div className={cn('ml-1 flex h-2 w-2  rounded-full bg-green-700')}></div>
            </div>
        </div>
    );
};
