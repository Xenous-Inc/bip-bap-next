import { setCookie, getCookie, deleteCookie, hasCookie } from 'cookies-next';
import { type CookiesFn, type OptionsType } from 'cookies-next/lib/types';
import { z } from 'zod';
import { type EnumType } from '../types';
import { type CookieKey, cookieSchema } from './schema';

type CookieKeyType = EnumType<typeof CookieKey>;

type CookieValue = { [Key in CookieKeyType]: z.infer<(typeof cookieSchema)[Key]> };

export type CookieReturn<Key extends CookieKeyType> = CookieValue[Key];

export const cookie = (cookies?: CookiesFn) => ({
    has: <Key extends CookieKeyType>(key: Key, options?: OptionsType) => {
        return hasCookie(key, { ...options, cookies });
    },
    get: <Key extends CookieKeyType>(key: Key, options?: OptionsType): CookieReturn<Key> => {
        const value = getCookie(key, { ...options, cookies });

        const schema = cookieSchema[key];
        const parsed = schema.safeParse(value);

        if (parsed.success) {
            return parsed.data as CookieValue[Key];
        }

        if (schema instanceof z.ZodDefault) {
            return schema._def.defaultValue();
        }

        return undefined;
    },
    set: <Key extends CookieKeyType>(key: Key, value: CookieValue[Key], options?: OptionsType) => {
        const schema = cookieSchema[key];
        const parsed = schema.safeParse(value);

        if (parsed.success) {
            setCookie(key, parsed.data, { ...options, cookies });
            return;
        }

        if (schema instanceof z.ZodDefault) {
            setCookie(key, schema._def.defaultValue(), { ...options, cookies });
            return;
        }

        setCookie(key, undefined, { ...options, cookies });
    },
    delete: <Key extends CookieKeyType>(key: Key, options?: OptionsType) => {
        deleteCookie(key, { ...options, cookies });
    },
});
