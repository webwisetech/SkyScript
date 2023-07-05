// deno-lint-ignore-file no-explicit-any
import * as util from 'node:util';
import {
BooleanVal,
	MK_BOOL,
	MK_NATIVE_FN,
	MK_NULL,
	MK_NUMBER,
	NullVal,
	NumberVal,
	RuntimeVal,
StringVal,
} from "./values.ts";

export function createGlobalEnv() {
	const env = new Environment();
	// Create Default Global Enviornment
	env.declareVar("true", MK_BOOL(true), true);
	env.declareVar("false", MK_BOOL(false), true);
	env.declareVar("null", MK_NULL(), true);

	function println(this: any, args: RuntimeVal[], _scope: Environment){
        // deno-lint-ignore prefer-const
        let log: any[] = []

        for (const arg of args) {
            switch (arg.type) {
                case 'number':
                    log.push(((arg as NumberVal).value))
                    continue
                case 'string':
                    log.push((arg as StringVal).value)
                    continue
                case 'boolean':
                    log.push(((arg as BooleanVal).value))
                    continue
                case 'null':
                    log.push(((arg as NullVal).value))
                    continue
                default:
                    log.push(arg)
            }
        }

        console.log(util.format.apply(this, log))

        return { type: 'null', value: null } as NullVal; 
    }
	env.declareVar(
		"out",
		MK_NATIVE_FN(println),
		true
	);

	function timeFunction(_args: RuntimeVal[], _env: Environment) {
		return MK_NUMBER(Date.now());
	}
	env.declareVar("time", MK_NATIVE_FN(timeFunction), true);

	return env;
}

export default class Environment {
	private parent?: Environment;
	private variables: Map<string, RuntimeVal>;
	private constants: Set<string>;

	constructor(parentENV?: Environment) {
		this.parent = parentENV;
		this.variables = new Map();
		this.constants = new Set();
	}

	public declareVar(
		varname: string,
		value: RuntimeVal,
		constant: boolean
	): RuntimeVal {
		if (this.variables.has(varname)) {
			throw `Cannot declare variable ${varname}. As it already is defined.`;
		}

		this.variables.set(varname, value);
		if (constant) {
			this.constants.add(varname);
		}
		return value;
	}

	public assignVar(varname: string, value: RuntimeVal): RuntimeVal {
		const env = this.resolve(varname);

		// Cannot assign to constant
		if (env.constants.has(varname)) {
			throw `Cannot reasign to variable ${varname} as it was declared constant.`;
		}

		env.variables.set(varname, value);
		return value;
	}

	public lookupVar(varname: string): RuntimeVal {
		const env = this.resolve(varname);
		return env.variables.get(varname) as RuntimeVal;
	}

	public resolve(varname: string): Environment {
		if (this.variables.has(varname)) {
			return this;
		}

		if (this.parent == undefined) {
			throw `Cannot resolve '${varname}' as it does not exist.`;
		}

		return this.parent.resolve(varname);
	}
}
