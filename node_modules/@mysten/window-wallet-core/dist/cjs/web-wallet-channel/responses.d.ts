import * as v from 'valibot';
export declare const ResponseData: v.VariantSchema<"type", [v.ObjectSchema<{
    readonly type: v.LiteralSchema<"connect", undefined>;
    readonly session: v.StringSchema<"`session` is required">;
}, undefined>, v.ObjectSchema<{
    readonly type: v.LiteralSchema<"sign-transaction", undefined>;
    readonly bytes: v.StringSchema<undefined>;
    readonly signature: v.StringSchema<undefined>;
}, undefined>, v.ObjectSchema<{
    readonly type: v.LiteralSchema<"sign-and-execute-transaction", undefined>;
    readonly bytes: v.StringSchema<undefined>;
    readonly signature: v.StringSchema<undefined>;
    readonly digest: v.StringSchema<undefined>;
    readonly effects: v.StringSchema<undefined>;
}, undefined>, v.ObjectSchema<{
    readonly type: v.LiteralSchema<"sign-personal-message", undefined>;
    readonly bytes: v.StringSchema<undefined>;
    readonly signature: v.StringSchema<undefined>;
}, undefined>], undefined>;
export type ResponseDataType = v.InferOutput<typeof ResponseData>;
export declare const ResponsePayload: v.VariantSchema<"type", [v.ObjectSchema<{
    readonly type: v.LiteralSchema<"reject", undefined>;
    readonly reason: v.OptionalSchema<v.StringSchema<"`reason` must be a string">, never>;
}, undefined>, v.ObjectSchema<{
    readonly type: v.LiteralSchema<"resolve", undefined>;
    readonly data: v.VariantSchema<"type", [v.ObjectSchema<{
        readonly type: v.LiteralSchema<"connect", undefined>;
        readonly session: v.StringSchema<"`session` is required">;
    }, undefined>, v.ObjectSchema<{
        readonly type: v.LiteralSchema<"sign-transaction", undefined>;
        readonly bytes: v.StringSchema<undefined>;
        readonly signature: v.StringSchema<undefined>;
    }, undefined>, v.ObjectSchema<{
        readonly type: v.LiteralSchema<"sign-and-execute-transaction", undefined>;
        readonly bytes: v.StringSchema<undefined>;
        readonly signature: v.StringSchema<undefined>;
        readonly digest: v.StringSchema<undefined>;
        readonly effects: v.StringSchema<undefined>;
    }, undefined>, v.ObjectSchema<{
        readonly type: v.LiteralSchema<"sign-personal-message", undefined>;
        readonly bytes: v.StringSchema<undefined>;
        readonly signature: v.StringSchema<undefined>;
    }, undefined>], undefined>;
}, undefined>], undefined>;
export type ResponsePayloadType = v.InferOutput<typeof ResponsePayload>;
export declare const Response: v.ObjectSchema<{
    readonly id: v.SchemaWithPipe<[v.StringSchema<undefined>, v.UuidAction<string, undefined>]>;
    readonly source: v.LiteralSchema<"web-wallet-channel", undefined>;
    readonly payload: v.VariantSchema<"type", [v.ObjectSchema<{
        readonly type: v.LiteralSchema<"reject", undefined>;
        readonly reason: v.OptionalSchema<v.StringSchema<"`reason` must be a string">, never>;
    }, undefined>, v.ObjectSchema<{
        readonly type: v.LiteralSchema<"resolve", undefined>;
        readonly data: v.VariantSchema<"type", [v.ObjectSchema<{
            readonly type: v.LiteralSchema<"connect", undefined>;
            readonly session: v.StringSchema<"`session` is required">;
        }, undefined>, v.ObjectSchema<{
            readonly type: v.LiteralSchema<"sign-transaction", undefined>;
            readonly bytes: v.StringSchema<undefined>;
            readonly signature: v.StringSchema<undefined>;
        }, undefined>, v.ObjectSchema<{
            readonly type: v.LiteralSchema<"sign-and-execute-transaction", undefined>;
            readonly bytes: v.StringSchema<undefined>;
            readonly signature: v.StringSchema<undefined>;
            readonly digest: v.StringSchema<undefined>;
            readonly effects: v.StringSchema<undefined>;
        }, undefined>, v.ObjectSchema<{
            readonly type: v.LiteralSchema<"sign-personal-message", undefined>;
            readonly bytes: v.StringSchema<undefined>;
            readonly signature: v.StringSchema<undefined>;
        }, undefined>], undefined>;
    }, undefined>], undefined>;
    readonly version: v.LiteralSchema<"1", undefined>;
}, undefined>;
export type ResponseType = v.InferOutput<typeof Response>;
export type ResponseTypes = {
    [P in ResponseDataType as P['type']]: P;
};
