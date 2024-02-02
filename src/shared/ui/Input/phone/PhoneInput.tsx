import { Input, type InputProps } from '../default/Input';

// eslint-disable-next-line prefer-regex-literals, prettier/prettier, no-useless-escape
export const phoneNumberValidationPattern = new RegExp(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/);

export const PhoneInput: React.FC<InputProps> = ({ rules, ...props }) => {
    const phoneRules = {
        ...rules,
        pattern: {
            value: phoneNumberValidationPattern,
            message: 'Неправильный формат номера телефона',
        },
    };

    return <Input placeholder={'Номер телефона'} rules={phoneRules} {...props} />;
};
