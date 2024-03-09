import cn from 'classnames';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Popup, type PopupProps } from '~/entities/Popup';
import IconRegister from '~/shared/assets/icons/icon-register.svg';
import FacebookLogo from '~/shared/assets/icons/logo-facebook.svg';
import GoogleLogo from '~/shared/assets/icons/logo-google.svg';
import { EmailInput, PasswordInput, PhoneInput } from '~/shared/ui';

interface RegisterPopupProps extends Omit<PopupProps, 'title'> {
    hadleSignIn: (value: boolean) => void;
}

export const RegisterPopup: React.FC<RegisterPopupProps> = props => {
    const { hadleSignIn } = props;
    const {
        control,
        handleSubmit,
        watch,
        setError,
        getFieldState,
        formState: { errors },
    } = useForm({
        defaultValues: {
            email: '',
            phone: '',
            password: '',
            confirmation: '',
        },
    });

    const [isTermsChecked, setIsTermsChecked] = useState(false);

    const onSubmit = (data: any) => {
        alert(JSON.stringify(data));
    };

    const watchPasswords = watch(['password', 'confirmation']);

    useEffect(() => {
        if (watchPasswords[1] !== watchPasswords[0] && getFieldState('confirmation').isTouched) {
            setError('confirmation', { type: 'custom', message: 'Пароли не совпадают' });
        }
    }, [watchPasswords]);

    // TODO: Add links
    return (
        <Popup title={'Регистрация'} {...props}>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className={cn('flex flex-col items-center justify-center gap-y-8 px-10')}>
                    <div className={cn('flex flex-row gap-x-8 ')}>
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
                    {/* @ts-ignore */}
                    <EmailInput name={'email'} control={control} rules={{ required: true }} />
                    {/* @ts-ignore */}
                    <PhoneInput name={'phone'} control={control} rules={{ required: true }} />
                    {/* @ts-ignore */}
                    <PasswordInput name={'password'} control={control} rules={{ required: true }} />
                    <PasswordInput
                        name={'confirmation'}
                        placeholder={'Подтверждение пароля'}
                        //@ts-ignore
                        control={control}
                        error={errors?.confirmation?.message}
                        rules={{ required: true }}
                    />
                    <div className={cn('flex w-full  flex-row items-center justify-between')}>
                        <label
                            htmlFor='termsOffers'
                            className={cn('flex h-10 flex-row items-center justify-center gap-x-2 overflow-hidden')}
                        >
                            <input
                                required
                                type='checkbox'
                                id='termsOffers'
                                className={cn('checkbox')}
                                onChange={() => {
                                    setIsTermsChecked(!isTermsChecked);
                                }}
                                checked={isTermsChecked}
                            />
                            <div className={cn('flex flex-col items-start text-sm')}>
                                Я прочитал и принимаю
                                <a href={''} className={'text-btn-blue'}>
                                    условия оферты
                                </a>
                            </div>
                        </label>
                        <button
                            type='submit'
                            disabled={!isTermsChecked}
                            className={cn(
                                'btn-filled flex h-10 w-popup-buttons items-center justify-center text-sm transition-opacity',
                                !isTermsChecked && 'opacity-50'
                            )}
                        >
                            <IconRegister className={cn('h-5 w-5')} />
                            Регистрация
                        </button>
                    </div>
                    <a type='button' className={'text-btn-blue '} onClick={() => hadleSignIn(true)}>
                        Уже есть аккаунт?
                    </a>
                </div>
            </form>
        </Popup>
    );
};
