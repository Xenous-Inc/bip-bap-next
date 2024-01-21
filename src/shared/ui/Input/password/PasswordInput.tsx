import { Input, type InputProps } from '../default/Input';

export const PasswordInput: React.FC<InputProps> = ({ rules, ...props }) => {
    const passwordValidationPattern = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-])/;
    const passwordRules = {
        ...rules,
        pattern: {
            value: passwordValidationPattern,
            message: 'Неправильный формат пароля',
        },
        minLength: { value: 6, message: 'Пароль должен состоять минимум из 6-ти символов' },
    };
    return <Input placeholder={'Пароль'} rules={passwordRules} {...props} type='password' />;
};
