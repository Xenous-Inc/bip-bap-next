'use client';
import cn from 'classnames';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { type UpdateUserPasswordSchema } from '~/shared/api/schema/updateUserPassword';
import IconSave from '~/shared/assets/icons/save.svg';
import IconUser from '~/shared/assets/icons/user.svg';
import { EmailInput, PasswordInput, PhoneInput } from '~/shared/ui';
import { api } from '~/trpc/react';

export const PersonalPage: React.FC = () => {
    const {
        control,
        handleSubmit,
        watch,
        setError,
        getFieldState,
        formState: { errors },
    } = useForm({
        mode: 'onTouched',
        defaultValues: {
            email: '',
            phoneNumber: '',
            oldPassword: '',
            newPassword: '',
        },
    });

    const mutation = api.user.updatePassword.useMutation();

    const onSubmit = async (data: any) => {
        const input = data as UpdateUserPasswordSchema;
        mutation.mutate(input);
    };

    const watchPasswords = watch(['oldPassword', 'newPassword']);

    useEffect(() => {
        if (watchPasswords[0] === watchPasswords[1] && getFieldState('newPassword').isDirty) {
            setError('newPassword', { type: 'custom', message: 'Пароли совпадают' });
        }
    }, [watchPasswords]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className={cn('flex flex-col items-center justify-center')}>
                <div className={cn('flex w-96 flex-col items-center justify-center gap-y-8 py-72')}>
                    <div className={cn('flex flex-row gap-x-8')}></div>
                    <div className={cn('flex flex-row gap-x-2.5')}>
                        <IconUser className={cn('h-6')} />
                        <p>Личный кабинет</p>
                    </div>
                    {/* @ts-ignore */}
                    <EmailInput name={'email'} control={control} rules={{ required: true }} />
                    {/* @ts-ignore */}
                    <PhoneInput
                        name={'phoneNumber'}
                        placeholder='Телефон'
                        control={control}
                        rules={{ required: true }}
                    />
                    <PasswordInput
                        name={'oldPassword'}
                        placeholder='Старый пароль'
                        /* @ts-ignore */
                        control={control}
                        rules={{ required: true }}
                    />
                    <PasswordInput
                        name={'newPassword'}
                        placeholder={'Новый пароль'}
                        /* @ts-ignore */
                        control={control}
                        error={errors?.newPassword?.message}
                        rules={{ required: true }}
                    />
                    <div className={cn('flex w-full  flex-row items-center justify-center')}>
                        <label className={cn('flex h-10 flex-row items-center justify-center gap-x-2 overflow-hidden')}>
                            <button
                                type='submit'
                                className={cn(
                                    'btn-filled flex h-10 w-72 flex-row items-center justify-center text-sm transition-opacity'
                                )}
                            >
                                <IconSave className={cn('h-6')} />
                                <p className={cn('text-sm')}>Сохранить пароль</p>
                            </button>
                        </label>
                    </div>
                </div>
            </div>
        </form>
    );
};
