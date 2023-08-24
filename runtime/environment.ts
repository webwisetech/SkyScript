import { Runtime } from "./values.ts";
import { stdfun } from "./std/functions.ts";
import { stdvar } from "./std/variables.ts";

export function createGlobalEnv() {
	const env = new Environment();
	stdfun(env);
	stdvar(env);
	return env;
}

export default class Environment {
	private parent?: Environment;
	private variables: Map<string, Runtime>;
	private constants: Set<string>;

	constructor(parentENV?: Environment) {
		this.parent = parentENV;
		this.variables = new Map();
		this.constants = new Set();
	}

	public declareVar(
		varname: string,
		value: Runtime,
		constant: boolean
	): Runtime {
		if (this.variables.has(varname)) {
			throw `Cannot declare variable ${varname}. As it already is defined.`;
		}

		this.variables.set(varname, value);
		if (constant) {
			this.constants.add(varname);
		}
		return value;
	}

	public assignVar(varname: string, value: Runtime): Runtime {
		const env = this.resolve(varname);

		// Cannot assign to constant
		if (env.constants.has(varname)) {
			throw `Cannot reasign to variable ${varname} as it was declared constant.`;
		}

		env.variables.set(varname, value);
		return value;
	}

	public lookupVar(varname: string): Runtime {
		const env = this.resolve(varname);
		return env.variables.get(varname) as Runtime;
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
