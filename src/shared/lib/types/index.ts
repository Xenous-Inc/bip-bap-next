import { type JSXElementConstructor } from 'react';

export type ReactTag = keyof JSX.IntrinsicElements | JSXElementConstructor<any>;

export type PropsOf<TTag extends ReactTag> = TTag extends React.ElementType ? React.ComponentProps<TTag> : never;

export type EnumType<T> = T[keyof T];

export type OneOf<T, U> =
    | (T & { [K in Exclude<keyof U, Extract<keyof T, keyof U>>]?: never })
    | (U & { [K in Exclude<keyof T, Extract<keyof T, keyof U>>]?: never });
