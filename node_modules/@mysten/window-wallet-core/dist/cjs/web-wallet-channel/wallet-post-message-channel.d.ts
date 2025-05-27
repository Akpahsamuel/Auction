import type { RequestType } from './requests.js';
import type { ResponsePayloadType } from './responses.js';
import { verifyJwtSession } from '../jwt-session/index.js';
export declare class WalletPostMessageChannel {
    #private;
    constructor(request: RequestType);
    static fromPayload(payload: RequestType): WalletPostMessageChannel;
    static fromUrlHash(hash?: string): WalletPostMessageChannel;
    getRequestData(): {
        version: "1";
        requestId: string;
        appUrl: string;
        appName: string;
        payload: {
            type: "connect";
        } | {
            type: "sign-transaction";
            transaction: string;
            address: string;
            chain: string;
            session: string;
        } | {
            type: "sign-and-execute-transaction";
            transaction: string;
            address: string;
            chain: string;
            session: string;
        } | {
            type: "sign-personal-message";
            message: string;
            address: string;
            chain: string;
            session: string;
        };
        metadata?: {
            [x: string]: import("./requests.js").JsonData;
        } | undefined;
        extraRequestOptions?: {
            [x: string]: import("./requests.js").JsonData;
        } | undefined;
    };
    verifyJwtSession(secretKey: Parameters<typeof verifyJwtSession>[1]): Promise<{
        payload: {
            accounts: {
                address: string;
                publicKey: string;
            }[];
        };
        exp: number;
        iat: number;
        iss: string;
        aud: string;
    } | null>;
    sendMessage(payload: ResponsePayloadType): void;
    close(payload?: ResponsePayloadType): void;
}
