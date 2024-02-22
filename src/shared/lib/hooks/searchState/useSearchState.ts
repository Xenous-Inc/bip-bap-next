'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo } from 'react';

export type Params = Record<string, string>;

export const useSearchState = (initialParams: Params = {}) => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const initializeParams = useCallback(() => {
        const prevParams = new URLSearchParams(searchParams.toString());

        Object.keys(initialParams).forEach(key => {
            if (initialParams[key]) prevParams.set(key, initialParams[key]!);
        });

        router.push(`?${prevParams.toString()}`);
    }, [initialParams, searchParams, router]);

    useEffect(() => {
        initializeParams();
    }, [initializeParams]);

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
