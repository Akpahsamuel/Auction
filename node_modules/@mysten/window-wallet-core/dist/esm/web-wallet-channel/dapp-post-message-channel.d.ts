import type { JsonData, RequestDataType } from './requests.js';
import type { ResponseTypes } from './responses.js';
type DappPostMessageChannelOptions = {
    appName: string;
    hostOrigin: string;
    hostPathname?: string;
    extraRequestOptions?: Record<string, JsonData>;
};
export declare class DappPostMessageChannel {
    #private;
    constructor({ appName, hostOrigin, hostPathname, extraRequestOptions, }: DappPostMessageChannelOptions);
    send<T extends RequestDataType['type']>({ type, ...data }: {
        type: T;
    } & Extract<RequestDataType, {
        type: T;
    }>): Promise<ResponseTypes[T]>;
    close(): void;
}
export {};
