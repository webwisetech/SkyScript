import { NumberVal, Runtime, StringVal } from "./values.ts";
import {
	AssignmentExpr,
	BinaryExpr,
	CallExpr,
	EqualityExpr,
	FunctionDeclaration,
	Identifier,
	IfStmt,
	NumericLiteral,
	ObjectLiteral,
	Program,
	Stmt,
	StringLiteral,
	VarDeclaration,
} from "../frontend/ast.ts";
import Environment from "./environment.ts";
import {
	eval_function_declaration,
	eval_if_stmt,
	eval_program,
	eval_var_declaration,
} from "./eval/statements.ts";
import {
	eval_assignment,
	eval_binary_expr,
	eval_call_expr,
	eval_equality_expr,
	eval_identifier,
	eval_object_expr,
} from "./eval/expressions.ts";

export function evaluate(astNode: Stmt, env: Environment): Runtime | StringVal {
	switch (astNode.kind) {
		case "NumericLiteral":
			return {
				value: (astNode as NumericLiteral).value,
				type: "number",
			} as NumberVal;
		case 'StringLiteral':
			return {
				value: ((astNode as StringLiteral).value),
				type: 'string'
			} as StringVal;
		case "Identifier":
			return eval_identifier(astNode as Identifier, env);
		case "ObjectLiteral":
			return eval_object_expr(astNode as ObjectLiteral, env);
		case "CallExpr":
			return eval_call_expr(astNode as CallExpr, env);
		case "AssignmentExpr":
			return eval_assignment(astNode as AssignmentExpr, env);
		case "BinaryExpr":
			return eval_binary_expr(astNode as BinaryExpr, env);
		case 'EqualityExpr':
			return eval_equality_expr(astNode as EqualityExpr, env);
		case 'IfStmt':
			return eval_if_stmt(astNode as IfStmt, env)	
		case "Program":
			return eval_program(astNode as Program, env);
		// Handle statements
		case "VarDeclaration":
			return eval_var_declaration(astNode as VarDeclaration, env);
		case "FunctionDeclaration":
			return eval_function_declaration(astNode as FunctionDeclaration, env);
		// Handle unimplimented ast types as error.
		default:
			console.error(
				"This AST Node has not yet been setup for interpretation.\n",
				astNode
			);
			Deno.exit(0);
	}
}