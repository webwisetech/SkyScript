import { MK_BOOL, MK_NULL, RuntimeVal } from "./values.ts";

function setupScope(env: Environment){
    env.declareVar("true", MK_BOOL(true), true);
    env.declareVar("false", MK_BOOL(false), true);
    env.declareVar("null", MK_NULL(), true);
}

export default class Environment {
    private parent?: Environment;
    private variables: Map<string, RuntimeVal>;
    private constants: Set<string>;

    constructor(parentENV?: Environment) {
        const global = parentENV ? true : false;
        this.parent = parentENV;
        this.variables = new Map();
        this.constants = new Set();

        if(global)
        setupScope(this);
    }

    public declareVar(varname: string, value: RuntimeVal, constant: boolean): RuntimeVal {
        if(this.variables.has(varname)){
            throw `Error: Variable ${varname} is already defined`;
        }

        this.variables.set(varname, value);

        if(constant){
            this.constants.add(varname);
        }

        return value;
    }

    public assignVar(varname: string, value: RuntimeVal): RuntimeVal {
        const env = this.resolve(varname);
        if(env.constants.has(varname)){
            throw `variable ${varname} is locked, thus you cannot edit/change it`;
        }
        env.variables.set(varname, value);
        return value;
    }

    public lookupVar(varname: string): RuntimeVal {
        const env = this.resolve(varname);
        return env.variables.get(varname) as RuntimeVal;
    }

    public resolve(varname: string): Environment {
        if(this.variables.has(varname)){
            return this;
        }

        if(this.parent == undefined){
            throw `Variable ${varname} is undefined`;
        }

        return this.parent.resolve(varname);
    }
}