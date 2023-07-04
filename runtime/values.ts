export type ValueTypes = "null" | "number" | "boolean" | "object";

export interface RuntimeVal {
    type: ValueTypes;
}

export interface NullVal extends RuntimeVal {
    type: "null";
    value: null;
}
export function MK_NULL(){
    return { value: null, type: "null" } as NullVal;
}

export interface BooleanVal extends RuntimeVal {
    type: "boolean";
    value: boolean;
}
export function MK_BOOL(b = true){
    return { value: b , type: "boolean" } as BooleanVal;
}

export interface NumberVal extends RuntimeVal {
    type: "number";
    value: number;
}

export function MK_NUM(value = 0){
    return { value: value, type: "number" } as NumberVal;
}

export interface ObjectVal extends RuntimeVal {
    type: "object";
    properties: Map<string, RuntimeVal>;
}