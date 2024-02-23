'use client';

import cn from 'classnames';
import { useAtom } from 'jotai';
import React, { useState } from 'react';
import IconClose from '~/shared/assets/icons/icon_close.svg';
import LayerIcon from '~/shared/assets/icons/layers.svg';
import SensorsIcon from '~/shared/assets/icons/map-pin.svg';
import GradientIcon from '~/shared/assets/icons/trending-up.svg';
import { GradientLayer, Layer, SensorsLayer } from '../model/constants';
import { LayerStateAtom } from '../model/state';

export const LayerPicker: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [layerState, setLayerState] = useAtom(LayerStateAtom);
    return (
        <div className='absolute bottom-10 right-7  z-50 h-12 w-12'>
            <div
                className={cn(
                    'absolute bottom-0 right-1/2 top-0 flex h-auto flex-row items-center justify-start gap-x-4 overflow-hidden rounded-l-full bg-white pl-3 transition-all',
                    isOpen ? 'w-80' : 'w-0'
                )}
            >
                <button
                    onClick={() => {
                        setLayerState(GradientLayer);
                    }}
                >
                    <span
                        className={cn(
                            'flex flex-row items-center justify-center gap-x-1 rounded-full px-2 outline-none',
                            layerState.layer === Layer.Gradient ? 'bg-btn-blue text-white' : 'bg-white text-black'
                        )}
                    >
                        <GradientIcon
                            className={cn(
                                ' m-2 h-6 w-6 stroke-current',
                                layerState.layer === Layer.Gradient ? 'text-white' : 'text-btn-grey'
                            )}
                        />
                        Градиент
                    </span>
                </button>
                <button
                    onClick={() => {
                        setLayerState(SensorsLayer);
                    }}
                >
                    <span
                        className={cn(
                            'flex flex-row items-center justify-center gap-x-1 rounded-full px-2 outline-none',
                            layerState.layer === Layer.Sensors ? 'bg-btn-blue text-white' : 'bg-white text-black'
                        )}
                    >
                        <SensorsIcon
                            className={cn(
                                'm-2 h-6 w-6 stroke-current',
                                layerState.layer === Layer.Sensors ? 'text-white' : 'text-btn-grey'
                            )}
                        />
                        Датчики
                    </span>
                </button>
            </div>
            <button
                className={cn(
                    'focus:duration-800 absolute flex h-full w-full items-center justify-center rounded-full bg-white shadow-layer outline-none transition-all duration-300 focus:shadow-blue-300',
                    isOpen ? 'origin-center rotate-180' : 'origin-center rotate-0'
                )}
                onClick={() => {
                    setIsOpen(prev => !prev);
                }}
            >
                {isOpen ? <IconClose className={cn('h-8 w-8')} /> : <LayerIcon className={cn('h-8 w-8')} />}
            </button>
        </div>
    );
};
