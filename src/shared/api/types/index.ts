import { AxiosError } from 'axios';
import { type EnumType } from '../../lib';

export const ErrorStatus = {
    Unathorized: 401,
} as const;

export type ErrorStatusType = EnumType<typeof ErrorStatus>;

export class ApiError extends AxiosError {
    constructor(error?: Partial<AxiosError>) {
        super(error?.message, error?.code, error?.config, error?.request, error?.response);

        this.status = error?.status ?? error?.response?.status;
        // @ts-expect-error
        this.message =
            // @ts-expect-error
            typeof error?.response?.data?.message === 'string'
                ? // @ts-expect-error
                  (error?.response?.data?.message as string)
                : error?.message;
    }
}
