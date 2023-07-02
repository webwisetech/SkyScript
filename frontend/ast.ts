export type NodeType = 
    // declarations
    | "Program" 
    | "VarDeclaration"
    // expressions
    | "NullLiteral"
    | "NumericLiteral" 
    | "Identifier" 
    | "BinaryExpression";

export interface Stmt {
    kind: NodeType;
}

export interface Program extends Stmt {
    kind: "Program";
    body: Stmt[];
}

export interface VarDeclaration extends Stmt {
    kind: "VarDeclaration";
    constant: boolean,
    identifier: string,
    value?: Expression;
}

// deno-lint-ignore no-empty-interface
export interface Expression extends Stmt {}

export interface BinaryExpression extends Expression {
    kind: "BinaryExpression";
    left: Expression;
    right: Expression;
    operator: string;
}

export interface Identifier extends Expression {
    kind: "Identifier";
    symbol: string;
}

export interface NumericLiteral extends Expression {
    kind: "NumericLiteral";
    value: number;
}
/*
    | "CallExpresion" 
    | "UnaryExpression" 
    | "FunctionDesclarations";
*/