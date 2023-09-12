import {
	FunctionDeclaration,
	IfStatement,
	Program,
	VarDeclaration,
} from "../../syntax/ast.ts";
import Environment from "../environment.ts";
import { evaluate } from "../interpreter.ts";
import { BooleanValue, FunctionValue, makeNull, Runtime } from "../values.ts";

export function evaluateProgram(program: Program, env: Environment): Runtime {
	let lastEvaluated: Runtime = makeNull();
	for (const statement of program.body) {
		lastEvaluated = evaluate(statement, env);
	}
	return lastEvaluated;
}

export function evaluateVariableDeclaration(
	declaration: VarDeclaration,
	env: Environment
): Runtime {
	const value = declaration.value
		? evaluate(declaration.value, env)
		: makeNull();

	return env.declareVar(declaration.identifier, value, declaration.constant);
}

export function evaluateFunctionDeclaration(
	declaration: FunctionDeclaration,
	env: Environment
): Runtime {
	
	const fn = {
		type: "function",
		name: declaration.name,
		parameters: declaration.parameters,
		declarationEnv: env,
		body: declaration.body,
	} as FunctionValue;

	return env.declareVar(declaration.name, fn, true);
}

export function evaluateIfStatement(statement: IfStatement, env: Environment): Runtime {
    const conditional: Runtime = evaluate(statement.conditional, env)

    if (conditional.type == 'boolean') {
        const result = (conditional as BooleanValue)
        const runtimeVal = result as Runtime
        if (isTruthy(runtimeVal)) {
            if (Array.isArray(statement.consequent)) {
                
                for (const consequentStatement of statement.consequent) {
                  evaluate(consequentStatement, env);
                }
            } else {
                
                return evaluate(statement.consequent, env);
            }
        } else {
            if (statement.alternate) {
                if (Array.isArray(statement.alternate)) {
                    
                    for (const alternateStatement of statement.alternate) {
                      evaluate(alternateStatement, env);
                    }
                } else {
                    
                    return evaluate(statement.alternate, env);
                }
            }
        }
    } else {
        if (isTruthy(conditional)) {
            if (Array.isArray(statement.consequent)) {
              
              for (const consequentStatement of statement.consequent) {
                evaluate(consequentStatement, env);
              }
            } else {
              
              return evaluate(statement.consequent, env);
            }
        } else {
            if (statement.alternate) {
                if (Array.isArray(statement.alternate)) {
                    
                    for (const alternateStatement of statement.alternate) {
                      evaluate(alternateStatement, env);
                    }
                } else {
                    
                    return evaluate(statement.alternate, env);
                }
            }
        }
    }
      
    return makeNull();
}

function isTruthy(conditional: Runtime) {
    if (conditional.type == 'boolean') {
        const bool = (conditional as BooleanValue).value
        if (bool) return true
        else return false
    }

    if (conditional) {
        return true
    } else {
        return false
    }
}