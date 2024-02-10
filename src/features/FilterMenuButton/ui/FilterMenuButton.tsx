'use client';
//TODO: create localisation for placeholder
import cn from 'classnames';
import { useEffect, useState } from 'react';
import { DisplayValue } from '~/entities/FilterMenu';
import Line from '~/shared/assets/icons/filter-line.svg';
import Sliders from '~/shared/assets/icons/sliders.svg';
import { useSearchState } from '~/shared/lib';

export interface FilterMenuButtonProps {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    styledPosition?: string;
}

export interface DisplayPlaceholderProps {
    placeholder: string[];
}

const createPlaceholder = (params: string | undefined, display: string | undefined) => {
    const placeholder: string[] = [];
    if (display === DisplayValue.AllSensors && params?.split('+').length === 3) {
        placeholder.push('All');
        return placeholder;
    }
    if (display) {
        placeholder.push(display);
    }
    if (params) {
        placeholder.push(...params.split('+'));
    }

    return placeholder;
};

const DisplayPlaceholder: React.FC<DisplayPlaceholderProps> = props => {
    const { placeholder } = props;
    const countFilter = placeholder.length > 3 ? 2 : 1;

    switch (placeholder.length) {
        case 1:
            return <p>{placeholder[0]}</p>;
        case 2:
            return (
                <p className={'flex flex-row items-center gap-x-2'}>
                    {placeholder[0]}
                    <Line className={'h-4 w-1'} />
                    {placeholder[1]}
                </p>
            );

        default:
            return (
                <p className={'flex flex-row items-center gap-x-2'}>
                    {placeholder[0]}
                    <Line className={'h-4 w-1'} />
                    {placeholder[1]} <Line className={'h-4 w-1'} />
                    <div
                        className={
                            'flex h-6 w-6 items-center justify-center rounded-full bg-btn-blue p-1 text-sm text-white'
                        }
                    >
                        +{countFilter}
                    </div>
                </p>
            );
    }
};

export const FilterMenuButton: React.FC<FilterMenuButtonProps> = ({ isOpen, setIsOpen, styledPosition }) => {
    const searchState = useSearchState();
    const params = searchState.get().params;
    const display = searchState.get().display;

    const [placeholder, setPlaceholder] = useState(createPlaceholder(params, display));

    useEffect(() => {
        setPlaceholder(createPlaceholder(params, display));
    }, [params, display]);

    return (
        <button
            className={cn(
                'btn-shadow absolute z-10 h-12 w-fit items-center !gap-x-1 bg-white',
                styledPosition ? styledPosition : ' left-10 top-10'
            )}
            onClick={() => {
                setIsOpen(!isOpen);
            }}
        >
            <Sliders width='16px' height='16px' />
            <DisplayPlaceholder placeholder={placeholder} />
        </button>
    );
};
