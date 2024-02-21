import { useCallback, useMemo } from 'react';

export type Params = Record<string, string>;

export const useSessionStorageState = () => {
    const sessionState = sessionStorage;
    const get = useCallback(() => {
        const params: Params | undefined = {};
        Object.keys(sessionStorage).forEach(key => {
            params[key] = sessionStorage.getItem(key) ?? '';
        });
        return params;
    }, [sessionState]);

    const set = useCallback(
        (params: Params) => {
            for (const [key, value] of Object.entries(params)) {
                sessionStorage.setItem(key, value);
            }
        },
        [sessionState]
    );

    const remove = useCallback(
        (params: Params) => {
            Object.keys(params).forEach(key => {
                sessionStorage.removeItem(key);
            });
        },
        [sessionState]
    );

    return useMemo(
        () => ({
            get,
            set,
            remove,
        }),
        [get, set, remove]
    );
};
