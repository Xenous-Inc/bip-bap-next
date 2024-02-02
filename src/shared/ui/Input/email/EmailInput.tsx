import { Input, type InputProps } from '../default/Input';

export const emailValidationPattern = /[^@ \t\r\n]+@[^@ \t\r\n]+.[^@ \t\r\n]+/;

export const EmailInput: React.FC<InputProps> = ({ rules, ...props }) => {
    const emailRules = {
        ...rules,
        pattern: {
            value: emailValidationPattern,
            message: 'Неправильный формат адреса электронной почты',
        },
    };
    return <Input placeholder={'Email'} rules={emailRules} {...props} />;
};
