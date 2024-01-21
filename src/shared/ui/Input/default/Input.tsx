'use client';
import cn from 'classnames';
import React from 'react';
import { Controller, type ControllerFieldState } from 'react-hook-form';
import { type PropsOf } from '~/shared/lib';

const RenderInput: React.FC<PropsOf<'input'> & ControllerFieldState> = ({ placeholder, ...props }) => {
    const { invalid, isDirty, error } = props;

    return (
        <div className={'group relative w-full'}>
            <input
                {...props}
                className={cn(
                    'peer peer h-10 w-full rounded border bg-input-color px-2 text-xs outline-none',
                    invalid && 'border-error-color text-error-color'
                )}
            />
            <label
                className={cn(
                    'pointer-events-none absolute transform transition-all',
                    'left-0 top-0 flex h-full items-center pl-2 text-xs',
                    'peer-focus:h-4 peer-focus:text-[8px] peer-focus:text-placeholder-color',
                    isDirty && '!h-4 !text-[8px] text-placeholder-color',
                    invalid && '!text-error-color'
                )}
            >
                {placeholder}
            </label>
            {invalid && <p className='absolute right-0 text-[8px] text-red-500'>{error?.message}</p>}
        </div>
    );
};

export type InputProps = PropsOf<'input'> & Omit<PropsOf<typeof Controller>, 'render'>;

export const Input: React.FC<InputProps> = props => {
    return (
        <Controller
            {...props}
            render={({ field, fieldState }) => <RenderInput {...props} {...field} {...fieldState} />}
        />
    );
};
