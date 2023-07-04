export type NodeType = 
    // declarations
    | "Program" 
    | "VarDeclaration"
    // expressions
    | "AssignmentExpr"
    | "MemberExpr"
    | "NullLiteral"
    | "NumericLiteral" 
    | "Property"
    | "ObjectLiteral"
    | "Identifier" 
    | "BinaryExpression"
    | "CallExpresion" 
    | "UnaryExpression" 
    | "FunctionDeclaration";

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

export interface AssignmentExpr extends Expression {
    kind: "AssignmentExpr";
    assigne: Expression;
    value: Expression;
}

export interface BinaryExpression extends Expression {
    kind: "BinaryExpression";
    left: Expression;
    right: Expression;
    operator: string;
}

export interface CallExpr extends Expression {
    kind: "CallExpr";
    args: Expr[];
    caller: Expr;
}

export interface MemberExpr extends Expression {
    kind: "MemberExpr";
    object: Expression;
    property: Expression;
    computed: boolean;
}

export interface Identifier extends Expression {
    kind: "Identifier";
    symbol: string;
}

export interface NumericLiteral extends Expression {
    kind: "NumericLiteral";
    value: number;
}

export interface Property extends Expression {
    kind: "Property";
    key: string;
    value: Expression;
}

export interface ObjectLiteral extends Expression {
    kind: "ObjectLiteral";
    value: Property[];
}