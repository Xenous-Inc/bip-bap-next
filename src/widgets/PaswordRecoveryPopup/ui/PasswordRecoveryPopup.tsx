import cn from 'classnames';
import { useForm } from 'react-hook-form';
import { Popup, type PopupProps } from '~/entities/Popup';
import IconLock from '~/shared/assets/icons/icon-lock.svg';
import { PhoneInput } from '~/shared/ui';

interface PasswordRecoveryPopupProps extends Omit<PopupProps, 'title'> {
    hadleSignIn: (value: boolean) => void;
}
export const PasswordRecoveryPopup: React.FC<PasswordRecoveryPopupProps> = props => {
    const { hadleSignIn } = props;
    const { control, handleSubmit } = useForm({
        defaultValues: {
            phone: '',
        },
    });

    const onSubmit = (data: any) => {
        alert(JSON.stringify(data));
    };

    // TODO: Add links
    return (
        <Popup title={'Востановить пароль'} {...props}>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className={cn('flex flex-col items-center justify-center gap-y-8 px-10 text-btn-grey')}>
                    <p>Введите данные, указанные при регистрации и мы отправим Вам новый пароль</p>
                    {/* @ts-ignore */}
                    <PhoneInput name={'phone'} control={control} rules={{ required: true }} />
                    <div className={cn('flex w-auto  flex-row items-center justify-center')}>
                        <button
                            type='submit'
                            className={cn(
                                'btn-filled w- flex h-10 items-center justify-center text-sm transition-opacity'
                            )}
                        >
                            <IconLock className={cn('h-5 w-5')} />
                            <p className='text-sm'>Востановить пароль</p>
                        </button>
                    </div>
                    <a type='submit' className={'text-btn-blue '} onClick={() => hadleSignIn(true)}>
                        Уже есть аккаунт?
                    </a>
                </div>
            </form>
        </Popup>
    );
};
