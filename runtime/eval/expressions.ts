import {
	AssignmentExpression,
	BinaryExpression,
	CallExpression,
	EqualityExpression,
	Identifier,
	MemberExpression,
	ObjectLiteral,
	ArrayLiteral
} from "../../syntax/ast.ts";
import { typeOfToken } from "../../syntax/lexer.ts";
import Environment from "../environment.ts";
import { evaluate } from "../interpreter.ts";
import { SkyScriptErr } from "../others/error.ts";
import {
ArrayValue,
	BooleanValue,
	FunctionValue,
	makeNull,
	NativeFnValue,
	NumberValue,
	ObjectValue,
	Runtime,
	StringValue,
} from "../values.ts";

function evaluateNumericBinaryExpression(
	lhs: NumberValue,
	rhs: NumberValue,
	operator: string
): NumberValue {
	let result: number;
	if (operator == "+") {
		result = lhs.value + rhs.value;
	} else if (operator == "-") {
		result = lhs.value - rhs.value;
	} else if (operator == "*") {
		result = lhs.value * rhs.value;
	} else if (operator == "/") {
		
		result = lhs.value / rhs.value
	} else {
		result = lhs.value % rhs.value;
	}

	return { value: result, type: "number" };
}

/**
 * Evaulates Expressionessions following the binary operation type.
 */
export function evaluateBinaryExpression(
	binop: BinaryExpression,
	env: Environment
): Runtime {
	const lhs = evaluate(binop.left, env);
	const rhs = evaluate(binop.right, env);

	
	if((lhs.type !== null && lhs.type !== undefined) && (rhs.type !== null && rhs.type !== undefined)){
	if (lhs.type == "number" && rhs.type == "number") {
		return evaluateNumericBinaryExpression(
			lhs as NumberValue,
			rhs as NumberValue,
			binop.operator
		);
	}
	if(lhs.type == "string" && rhs.type == "string"){
		return evaluateStringBinaryExpression(
			lhs as StringValue,
			rhs as StringValue,
			binop.operator
		)
	}
} else {
	return evaluateStringBinaryExpression(
		lhs,
		rhs,
		binop.operator
	)
}

	
	return makeNull();
}

export function evaluateIdentifier(
	ident: Identifier,
	env: Environment
): Runtime {
	const val = env.lookupVar(ident.symbol);
	return val;
}

export function evaluateAssignment(
	node: AssignmentExpression,
	env: Environment
): Runtime {
	if (node.assigne.kind !== "Identifier") {
		throw new SkyScriptErr("Invalid assignment - "+node.assigne);
	}

	const varname = (node.assigne as Identifier).symbol;
	return env.assignVar(varname, evaluate(node.value, env));
}

export function evaluateArrays(
	arr: ArrayLiteral,
	env: Environment
): Runtime[] {
	const array = { type: "array", elements: [] as Runtime[] } as ArrayValue;

	for(const { value } of arr.elements){
		const Runtime =
			value == undefined ? env.lookupVar(value) : evaluate(value, env);
		if(Runtime.value !== undefined)
			array.elements.push(Runtime.value);
		else
			array.elements.push(Runtime);
	}

	return array.elements
}

export function evaluateObjectExpression(
	obj: ObjectLiteral,
	env: Environment
): Runtime {
	const object = { type: "object", properties: new Map() } as ObjectValue;
	for (const { key, value } of obj.properties) {
		const Runtime =
			value == undefined ? env.lookupVar(key) : evaluate(value, env);

		object.properties.set(key, Runtime);
	}

	return object;
}

export function evaluateCallExpression(Expression: CallExpression, env: Environment): Runtime {
	const args = Expression.args.map((arg) => evaluate(arg, env));
	const fn = evaluate(Expression.caller, env);

	if (fn.type == "native-fn") {
		const result: StringValue | Runtime = (fn as NativeFnValue).call(args, env);
		return result;
	}

	if (fn.type == "function") {
		const func = fn as FunctionValue;
		const scope = new Environment(func.declarationEnv);

		
		for (let i = 0; i < func.parameters.length; i++) {
			
			
			const varname = func.parameters[i];
			scope.declareVar(varname, args[i], false);
		}

		let result: Runtime = makeNull();
		for (const Statement of func.body) {
			result = evaluate(Statement, scope);
		}

		return result;
	}

	throw "Cannot call value that is not a function: " + JSON.stringify(fn);
}

export function evaluateStringBinaryExpression(leftHandSide: StringValue, rightHandSide: StringValue, operator: string): StringValue {
    let result: string
	let lhs = leftHandSide.value;
	let rhs = rightHandSide.value;

	if(leftHandSide.value === undefined)
		lhs = (leftHandSide as unknown) as string;
	if(rightHandSide.value === undefined)
		rhs = (rightHandSide as unknown) as string;

    if (operator == '+') result = `${lhs.replace("\\n", "\n")}` + `${rhs.replace("\\n", "\n")}`
    else {
        throw new SkyScriptErr(`Cannot use operator "${operator}" in string Expression.`);
    }

    return { value: result, type: 'string' };
}

export function eval_memberExpression(Expressionession: MemberExpression, env: Environment): Runtime {
    const object = evaluate(Expressionession.object, env)
    const property = (Expressionession.property as Identifier).symbol
  
    if (object.type === 'object') {
        const objValue = object as ObjectValue
        const propertyValue = objValue.properties.get(property)
        
        if (propertyValue !== undefined) {
            return propertyValue
        } else {
            throw `Property "${property}" does not exist on object.`;
      }
    } else {
        throw new SkyScriptErr('Cannot access property on non-object value.');
    }
}

export function evaluateEqualityExpression(Expressionession: EqualityExpression, env: Environment): Runtime {
    const left = evaluate(Expressionession.left, env)
    const right = evaluate(Expressionession.right, env)
    const operator = Expressionession.operator

    if (isTruthy(left, operator, right)) {

        return { type: 'boolean', value: true } as Runtime
    } else {
        return { type: 'boolean', value: false } as Runtime
    }
}

function isTruthy(left: Runtime, operator: typeOfToken, right: Runtime): boolean {
    switch (operator) {
        case typeOfToken.DoubleEquals:{
            if ((left as BooleanValue).value == (right as BooleanValue).value || (left as StringValue).value == (right as unknown) as string) return true
            else return false
		}
        case typeOfToken.NotEquals:
            if ((left as BooleanValue).value != (right as BooleanValue).value) return true
            else return false
		default:
			return false;
    }
}



/*

export function evaluateBinaryExpressiona(binop: BinaryExpression, env: Environment): Runtime {
    const leftHandSide = evaluate(binop.left, env)
    const rightHandSide = evaluate(binop.right, env)
	console.log({leftHandSide, rightHandSide})

    if (leftHandSide.type == 'number' && rightHandSide.type == 'number') {
		console.log("isanum")
        return evaluateNumericBinaryExpression(leftHandSide as NumberValue, rightHandSide as NumberValue, binop.operator);
    } else if (leftHandSide.type == 'string' && rightHandSide.type == 'string') {
		console.log("isastr")
        return evaluateStringBinaryExpression(leftHandSide as StringValue, rightHandSide as StringValue, binop.operator);
    }

    
    return { type: 'null', value: null } as NullValue;
}
*/