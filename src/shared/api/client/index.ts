import axios from 'axios';
import { env } from '../../lib';
import {
    loggingRequestInterceptorHandlers,
    loggingResponseInterceptorHandlers,
    transformErrorInterceptorHandler,
} from '../interceptors';

export const client = axios.create({
    baseURL: env.NEXT_PUBLIC_REST_URL,
    validateStatus: status => status >= 200 && status <= 302,
});

client.interceptors.request.use(...loggingRequestInterceptorHandlers);

client.interceptors.response.use(response => response, transformErrorInterceptorHandler);
client.interceptors.response.use(...loggingResponseInterceptorHandlers);
