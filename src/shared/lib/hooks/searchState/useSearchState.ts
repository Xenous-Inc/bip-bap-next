import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';

export type Params = Record<string, string>;

export const useSearchState = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const get = useCallback(() => {
        const params: Params = {};

        searchParams.forEach((value, key) => {
            params[key] = value;
        });

        return params;
    }, [searchParams]);

    const set = useCallback(
        (params: Params) => {
            const prevParams = new URLSearchParams(searchParams.toString());

            Object.keys(params).forEach(key => {
                if (params[key]) prevParams.set(key, params[key]!);
            });

            router.push(`?${prevParams.toString()}`);
        },
        [searchParams, router]
    );

    const link = useCallback(
        (params: Params) => {
            const prevParams = new URLSearchParams(searchParams.toString());

            Object.keys(params).forEach(key => {
                if (params[key]) prevParams.set(key, params[key]!);
            });

            return `?${prevParams.toString()}`;
        },
        [searchParams]
    );

    const remove = useCallback(
        (params: Params) => {
            const prevParams = new URLSearchParams(searchParams.toString());

            Object.keys(params).forEach(key => {
                if (params[key]) prevParams.delete(key);
            });

            router.push(`?${prevParams.toString()}`);
        },
        [searchParams, router]
    );

    return useMemo(
        () => ({
            get,
            set,
            link,
            remove,
        }),
        [get, set, link, remove]
    );
};
