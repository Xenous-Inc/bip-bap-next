'use client';

import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment } from 'react';

interface SideSheetProps extends React.PropsWithChildren {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
}

export const SideSheet: React.FC<SideSheetProps> = props => {
    const { isOpen, setIsOpen, children } = props;
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog
                as='div'
                onClose={() => {
                    setIsOpen(false);
                }}
                className={'fixed inset-0 z-10 flex drop-shadow-xl'}
            >
                <Transition.Child
                    enter='transition transform ease-in-out duration-200 sm:duration-500'
                    enterFrom='-translate-x-full'
                    enterTo='translate-x-0'
                    leave='transition transform ease-in-out duration-200 sm:duration-500'
                    leaveFrom='translate-x-0'
                    leaveTo='-translate-x-full'
                >
                    <Dialog.Panel className={'h-full w-80 bg-white'}>
                        <div className={'flex h-full flex-col justify-between p-7'}>{children}</div>
                    </Dialog.Panel>
                </Transition.Child>
            </Dialog>
        </Transition>
    );
};
