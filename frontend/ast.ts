// deno-lint-ignore-file no-empty-interface

import { TokenType } from "./lexer.ts";

export type NodeType =
    // statements
	| "Program"
	| "VarDeclaration"
	| "Property"
	| "IfStmt"
	| "Identifier"
	| "FunctionDeclaration"
	// expressions
	| "EqualityExpr"
	| "BinaryExpr"
	| "AssignmentExpr"
	| "MemberExpr"
	| "CallExpr"
	// literals
	| "ObjectLiteral"
	| "ArrayLiteral"
	| "NumericLiteral"
	| "StringLiteral";

export interface Stmt {
	kind: NodeType;
}

export interface Program extends Stmt {
	kind: "Program";
	body: Stmt[];
}

export interface VarDeclaration extends Stmt {
	kind: "VarDeclaration";
	constant: boolean;
	identifier: string;
	value?: Expr;
}

export interface FunctionDeclaration extends Stmt {
	kind: "FunctionDeclaration";
	parameters: string[];
	name: string;
	body: Stmt[];
}

export interface IfStmt extends Stmt {
    kind: 'IfStmt';
    conditional: Expr;
    operator: TokenType;
    consequent: Stmt[];
    alternate?: Stmt[];
}

export interface Expr extends Stmt {}

export interface AssignmentExpr extends Expr {
	kind: "AssignmentExpr";
	assigne: Expr;
	value: Expr;
}

export interface BinaryExpr extends Expr {
	kind: "BinaryExpr";
	left: Expr;
	right: Expr;
	operator: string;
}

export interface CallExpr extends Expr {
	kind: "CallExpr";
	args: Expr[];
	caller: Expr;
}

export interface MemberExpr extends Expr {
	kind: "MemberExpr";
	object: Expr;
	property: Expr;
	computed: boolean;
}

export interface Identifier extends Expr {
	kind: "Identifier";
	symbol: string;
}

export interface NumericLiteral extends Expr {
	kind: "NumericLiteral";
	value: number;
}

export interface Property extends Expr {
	kind: "Property";
	key: string;
	value?: Expr;
}

export interface ObjectLiteral extends Expr {
	kind: "ObjectLiteral";
	properties: Property[];
}

export interface ArrayLiteral extends Expr {
	kind: "ArrayLiteral";
	elements: Expr[];
}

export interface StringLiteral extends Expr {
    kind: 'StringLiteral';
    value: string;
}

export interface EqualityExpr extends Expr {
    kind: 'EqualityExpr';
    left: Expr;
    right: Expr;
    operator: TokenType;
}