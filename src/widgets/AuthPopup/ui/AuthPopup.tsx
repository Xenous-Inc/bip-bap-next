'use client';

import cn from 'classnames';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Popup, type PopupProps } from '~/entities/Popup';
import IconSignIn from '~/shared/assets/icons/logo-enter.svg';
import FacebookLogo from '~/shared/assets/icons/logo-facebook.svg';
import GoogleLogo from '~/shared/assets/icons/logo-google.svg';
import { Input, PasswordInput } from '~/shared/ui';
import { emailValidationPattern } from '~/shared/ui/Input/email/EmailInput';
import { phoneNumberValidationPattern } from '~/shared/ui/Input/phone/PhoneInput';
import { PasswordRecoveryPopup } from '~/widgets/PaswordRecoveryPopup';
import { RegisterPopup } from '~/widgets/RegisterPopup/ui/RegisterPopup';

export const AuthPopup: React.FC<Omit<PopupProps, 'title'>> = props => {
    const { control, handleSubmit } = useForm({
        defaultValues: {
            login: '',
            password: '',
        },
    });

    const [isRememberMe, setIsRememberMe] = useState(false);

    const [PasswordRecoveryPopupOpen, setPasswordRecoveryPopupOpen] = useState(false);
    const [RegisterPopupOpen, setRegisterPopup] = useState(false);

    const onSubmit = (data: any) => {
        alert(JSON.stringify(data));
    };

    // TODO: add links
    return (
        <Popup title={'Вход'} {...props}>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className={cn('flex flex-col items-center justify-center gap-y-8 px-10')}>
                    <div className={cn('flex w-full flex-row justify-between')}>
                        <button
                            type='button'
                            className={cn(
                                'btn-outlined flex h-10 w-popup-buttons items-center justify-center !border !border-btn-grey text-sm'
                            )}
                        >
                            <GoogleLogo className={cn('h-5 w-5')} />
                            Войти с Google
                        </button>
                        <button
                            type='button'
                            className={cn(
                                'btn-filled flex h-10 w-popup-buttons items-center justify-center !bg-facebook-bg-color text-sm'
                            )}
                        >
                            <FacebookLogo className={cn('h-5 w-5')} />
                            Войти с Facebook
                        </button>
                    </div>
                    <p>или</p>
                    <Input
                        name={'login'}
                        //@ts-ignore
                        control={control}
                        placeholder={'Номер телефона или Email'}
                        rules={{
                            required: true,
                            validate: value => {
                                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                                if (!emailValidationPattern.test(value) && !phoneNumberValidationPattern.test(value)) {
                                    return 'Неверный формат';
                                }
                                return true;
                            },
                        }}
                    />
                    {/* @ts-ignore */}
                    <PasswordInput name={'password'} control={control} rules={{ required: true }} />
                    <div className={cn('flex w-full  flex-row items-center justify-between')}>
                        <label
                            htmlFor='rememberMe'
                            className={cn('flex h-10 flex-row items-center justify-center gap-x-2 overflow-hidden')}
                        >
                            <input
                                type='checkbox'
                                id='rememberMe'
                                className={cn('checkbox')}
                                onChange={() => {
                                    setIsRememberMe(!isRememberMe);
                                }}
                                checked={isRememberMe}
                            />
                            <div className={cn('flex flex-col items-start')}>Запомнить меня</div>
                        </label>
                        <button
                            type='submit'
                            className={cn('btn-filled flex h-10 w-popup-buttons items-center justify-center text-sm ')}
                        >
                            <IconSignIn className={cn('h-5 w-5')} />
                            Вход
                        </button>
                    </div>
                    <div className={cn('flex w-full flex-row justify-between text-sm')}>
                        <p>
                            Впервые у нас?
                            <a onClick={() => setRegisterPopup(true)} className={'text-btn-blue'}>
                                Регистрация
                            </a>
                        </p>
                        <a onClick={() => setPasswordRecoveryPopupOpen(true)} className={'text-btn-blue'}>
                            Забыли пароль?
                        </a>
                        {PasswordRecoveryPopupOpen && (
                            <PasswordRecoveryPopup
                                isOpen={PasswordRecoveryPopupOpen}
                                setIsOpen={setPasswordRecoveryPopupOpen}
                            />
                        )}

                        {RegisterPopupOpen && <RegisterPopup isOpen={RegisterPopupOpen} setIsOpen={setRegisterPopup} />}
                    </div>
                </div>
            </form>
        </Popup>
    );
};
