'use client';
import { useState } from 'react';
import { LayerPicker } from '~/entities/LayerPicker';
import { Loader } from '~/entities/Loader';
import { SideScale } from '~/entities/SideScale';
import { FilterMenuButton } from '~/features/FilterMenuButton/ui/FilterMenuButton';
import { FilterMenu } from '~/widgets/FilterMenu';
import { MapComponent } from '~/widgets/Map';

export default () => {
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
    return (
        <main className={'flex min-h-screen w-full '}>
            <FilterMenu isOpen={isFilterMenuOpen} setIsOpen={setIsFilterMenuOpen} />
            <FilterMenuButton isOpen={isFilterMenuOpen} setIsOpen={setIsFilterMenuOpen} />
            <LayerPicker />
            <SideScale className={'absolute left-7  top-1/2  z-30 -translate-y-1/2 transform bg-white'} />
            <MapComponent />
        </main>
    );
};
