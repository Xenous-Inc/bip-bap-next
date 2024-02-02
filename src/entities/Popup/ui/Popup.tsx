'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import IconClose from '~/shared/assets/icons/icon_close.svg';

export interface PopupProps extends React.PropsWithChildren {
    title: string;
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
}

export const Popup: React.FC<PopupProps> = props => {
    const { isOpen, setIsOpen, title, children } = props;

    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog
                as='div'
                onClose={() => {
                    setIsOpen(false);
                }}
                className={'fixed inset-0 z-10 flex items-center justify-center '}
            >
                <Dialog.Overlay className={'fixed inset-0 h-auto w-auto bg-black/30 opacity-0'} />
                <Transition.Child
                    as={Fragment}
                    enter={'ease-out duration-300'}
                    enterFrom={'opacity-0'}
                    enterTo={'opacity-100'}
                    leave={'ease-in duration-200'}
                    leaveFrom={'opacity-100'}
                    leaveTo={'opacity-0'}
                >
                    <div className={'fixed inset-0 h-auto w-auto  bg-black bg-opacity-50'} />
                </Transition.Child>
                <Transition.Child
                    as={Fragment}
                    enter={'ease-out duration-300'}
                    enterFrom={'opacity-0 scale-90'}
                    enterTo={'opacity-100 scale-100'}
                    leave={'ease-in duration-200'}
                    leaveFrom={'opacity-100 scale-100'}
                    leaveTo={'opacity-0 scale-90'}
                >
                    <Dialog.Panel className='relative w-popup rounded-popup bg-white'>
                        <div className=' absolute right-0 top-0 h-5  '>
                            <button
                                className='cursor-pointer pr-5 pt-5 focus:outline-none '
                                onClick={() => {
                                    setIsOpen(false);
                                }}
                            >
                                <IconClose className={'h-6 w-6'} />
                            </button>
                        </div>
                        <Dialog.Title className={'pb-4 pt-8 text-center'}>{title}</Dialog.Title>
                        <div className={'items-center justify-center pb-8 text-center'}>{children}</div>
                    </Dialog.Panel>
                </Transition.Child>
            </Dialog>
        </Transition>
    );
};
