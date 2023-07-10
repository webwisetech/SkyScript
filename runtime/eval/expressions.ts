import {
	AssignmentExpr,
	BinaryExpr,
	CallExpr,
	EqualityExpr,
	Identifier,
	ObjectLiteral,
} from "../../frontend/ast.ts";
import { TokenType } from "../../frontend/lexer.ts";
import Environment from "../environment.ts";
import { evaluate } from "../interpreter.ts";
import {
BooleanVal,
	FunctionValue,
	MK_NULL,
	NativeFnValue,
	NullVal,
	NumberVal,
	ObjectVal,
	Runtime,
StringVal,
} from "../values.ts";

function eval_numeric_binary_expr(
	lhs: NumberVal,
	rhs: NumberVal,
	operator: string
): NumberVal {
	let result: number;
	if (operator == "+") {
		result = lhs.value + rhs.value;
	} else if (operator == "-") {
		result = lhs.value - rhs.value;
	} else if (operator == "*") {
		result = lhs.value * rhs.value;
	} else if (operator == "/") {
		// TODO: Division by zero checks
		result = lhs.value / rhs.value;
	} else {
		result = lhs.value % rhs.value;
	}

	return { value: result, type: "number" };
}

/**
 * Evaulates expressions following the binary operation type.
 */
export function eval_binary_expr(
	binop: BinaryExpr,
	env: Environment
): Runtime {
	const lhs = evaluate(binop.left, env);
	const rhs = evaluate(binop.right, env);

	// Only currently support numeric operations
	if (lhs.type == "number" && rhs.type == "number") {
		return eval_numeric_binary_expr(
			lhs as NumberVal,
			rhs as NumberVal,
			binop.operator
		);
	}

	// One or both are NULL
	return MK_NULL();
}

export function eval_identifier(
	ident: Identifier,
	env: Environment
): Runtime {
	const val = env.lookupVar(ident.symbol);
	return val;
}

export function eval_assignment(
	node: AssignmentExpr,
	env: Environment
): Runtime {
	if (node.assigne.kind !== "Identifier") {
		throw `Invalid LHS inaide assignment expr ${JSON.stringify(node.assigne)}`;
	}

	const varname = (node.assigne as Identifier).symbol;
	return env.assignVar(varname, evaluate(node.value, env));
}

export function eval_object_expr(
	obj: ObjectLiteral,
	env: Environment
): Runtime {
	const object = { type: "object", properties: new Map() } as ObjectVal;
	for (const { key, value } of obj.properties) {
		const Runtime =
			value == undefined ? env.lookupVar(key) : evaluate(value, env);

		object.properties.set(key, Runtime);
	}

	return object;
}

export function eval_call_expr(expr: CallExpr, env: Environment): Runtime {
	const args = expr.args.map((arg) => evaluate(arg, env));
	const fn = evaluate(expr.caller, env);

	if (fn.type == "native-fn") {
		const result: StringVal | Runtime = (fn as NativeFnValue).call(args, env);
		return result;
	}

	if (fn.type == "function") {
		const func = fn as FunctionValue;
		const scope = new Environment(func.declarationEnv);

		// Create the variables for the parameters list
		for (let i = 0; i < func.parameters.length; i++) {
			// TODO Check the bounds here.
			// verify arity of function
			const varname = func.parameters[i];
			scope.declareVar(varname, args[i], false);
		}

		let result: Runtime = MK_NULL();
		for (const stmt of func.body) {
			result = evaluate(stmt, scope);
		}

		return result;
	}

	throw "Cannot call value that is not a function: " + JSON.stringify(fn);
}

export function eval_string_binary_expr(leftHandSide: StringVal, rightHandSide: StringVal, operator: string): StringVal {
    let result: string

    if (operator == '+') result = leftHandSide.value + rightHandSide.value
    else {
        console.log(`Cannot use operator "${operator}" in string binary expression.`);
        Deno.exit(1);
    }

    return { value: result, type: 'string' };
}

export function evaluateBinaryExpression (binop: BinaryExpr, env: Environment): Runtime {
    const leftHandSide = evaluate(binop.left, env)
    const rightHandSide = evaluate(binop.right, env)

    if (leftHandSide.type == 'number' && rightHandSide.type == 'number') {
        return eval_numeric_binary_expr(leftHandSide as NumberVal, rightHandSide as NumberVal, binop.operator);
    } else if (leftHandSide.type == 'string' && rightHandSide.type == 'string') {
        return eval_string_binary_expr(leftHandSide as StringVal, rightHandSide as StringVal, binop.operator);
    }

    // One or both are NULL
    return { type: 'null', value: null } as NullVal;
}

export function eval_equality_expr(expression: EqualityExpr, env: Environment): Runtime {
    const left = evaluate(expression.left, env)
    const right = evaluate(expression.right, env)
    const operator = expression.operator

    if (isTruthy(left, operator, right)) {

        return { type: 'boolean', value: true } as Runtime
    } else {
        return { type: 'boolean', value: false } as Runtime
    }
}

function isTruthy(left: Runtime, operator: TokenType, right: Runtime): boolean {
    switch (operator) {
        case TokenType.DoubleEquals:
            if ((left as BooleanVal).value == (right as BooleanVal).value) return true
            else return false
        case TokenType.NotEquals:
            if ((left as BooleanVal).value != (right as BooleanVal).value) return true
            else return false
		default:
			return false;
    }
}