import * as v from 'valibot';
export type JsonData = string | number | boolean | null | {
    [key: string]: JsonData;
} | JsonData[];
export declare const RequestData: v.VariantSchema<"type", [v.ObjectSchema<{
    readonly type: v.LiteralSchema<"connect", undefined>;
}, undefined>, v.ObjectSchema<{
    readonly type: v.LiteralSchema<"sign-transaction", undefined>;
    readonly transaction: v.StringSchema<"`transaction` is required">;
    readonly address: v.StringSchema<"`address` is required">;
    readonly chain: v.StringSchema<"`chain` is required">;
    readonly session: v.StringSchema<"`session` is required">;
}, undefined>, v.ObjectSchema<{
    readonly type: v.LiteralSchema<"sign-and-execute-transaction", undefined>;
    readonly transaction: v.StringSchema<"`transaction` is required">;
    readonly address: v.StringSchema<"`address` is required">;
    readonly chain: v.StringSchema<"`chain` is required">;
    readonly session: v.StringSchema<"`session` is required">;
}, undefined>, v.ObjectSchema<{
    readonly type: v.LiteralSchema<"sign-personal-message", undefined>;
    readonly chain: v.StringSchema<"`chain` is required">;
    readonly message: v.StringSchema<"`message` is required">;
    readonly address: v.StringSchema<"`address` is required">;
    readonly session: v.StringSchema<"`session` is required">;
}, undefined>], undefined>;
export type RequestDataType = v.InferOutput<typeof RequestData>;
export declare const Request: v.ObjectSchema<{
    readonly version: v.LiteralSchema<"1", undefined>;
    readonly requestId: v.SchemaWithPipe<[v.StringSchema<"`requestId` is required">, v.UuidAction<string, undefined>]>;
    readonly appUrl: v.SchemaWithPipe<[v.StringSchema<undefined>, v.UrlAction<string, "`appUrl` must be a valid URL">]>;
    readonly appName: v.StringSchema<"`appName` is required">;
    readonly payload: v.VariantSchema<"type", [v.ObjectSchema<{
        readonly type: v.LiteralSchema<"connect", undefined>;
    }, undefined>, v.ObjectSchema<{
        readonly type: v.LiteralSchema<"sign-transaction", undefined>;
        readonly transaction: v.StringSchema<"`transaction` is required">;
        readonly address: v.StringSchema<"`address` is required">;
        readonly chain: v.StringSchema<"`chain` is required">;
        readonly session: v.StringSchema<"`session` is required">;
    }, undefined>, v.ObjectSchema<{
        readonly type: v.LiteralSchema<"sign-and-execute-transaction", undefined>;
        readonly transaction: v.StringSchema<"`transaction` is required">;
        readonly address: v.StringSchema<"`address` is required">;
        readonly chain: v.StringSchema<"`chain` is required">;
        readonly session: v.StringSchema<"`session` is required">;
    }, undefined>, v.ObjectSchema<{
        readonly type: v.LiteralSchema<"sign-personal-message", undefined>;
        readonly chain: v.StringSchema<"`chain` is required">;
        readonly message: v.StringSchema<"`message` is required">;
        readonly address: v.StringSchema<"`address` is required">;
        readonly session: v.StringSchema<"`session` is required">;
    }, undefined>], undefined>;
    readonly metadata: v.OptionalSchema<v.RecordSchema<v.StringSchema<undefined>, v.GenericSchema<JsonData, JsonData, v.BaseIssue<unknown>>, undefined>, never>;
    readonly extraRequestOptions: v.OptionalSchema<v.RecordSchema<v.StringSchema<undefined>, v.GenericSchema<JsonData, JsonData, v.BaseIssue<unknown>>, undefined>, never>;
}, undefined>;
export type RequestType = v.InferOutput<typeof Request>;
