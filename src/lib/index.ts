import Environment from "../runtime/env.js";
import path from 'path';
import { 
	FunctionCall,
	Runtime, 
	RuntimeValue, 
	makeNull, 
	makeNum, 
	makeStr,
  makeBool,
  makeArr,
  makeObj,
  makeNativeFn
} from "../runtime/val.js";
import { SkyScriptWarn } from "../util/warn.js";

import colors from './colors.js';
import math from './math.js';
import time from './time.js';
import io from './io.js';
import process from "./process.js";

async function runModule(	folderPath = "ss_mods",	fileName = "skyscript.js", 	context = {}) {
  const fullPath = path.resolve(folderPath+"/"+fileName);

  try {
    const module = await import("file://"+fullPath);
    if (typeof module.default === 'function'){
      module.default(context);
    } else {
      console.error(`The file ${fileName} does not export a function.`);
    }
  } catch (error) {
    console.error(`Error loading or executing ${fileName}: ${error}`);
  }
}

export class Library {
        env: Environment;
        packs: string[];
    
    constructor(
        packages: string[]
    ){
        this.env = new Environment();

        this.env.declareVar("true", makeBool(true), true);
      	this.env.declareVar("false", makeBool(false), true);
      	this.env.declareVar("null", makeNull(), true);

        this.packs = packages;
    }

    public async registerPacks(){
      const opts = this;

      const options = {
        makeStr,
        makeNull,
        makeNum,
        makeArr,

        library: opts
      };

      for(const pack of opts.packs){
        switch(pack){
          case "io":
            io(options);
          break;
          case "process":
            process(options);
          break;
          case "math":
            math(options);
          break;
          case "colors":
            colors(options);
          break;
          case "time":
            time(options)
          break;
          default:
            await runModule("./ss_mods", pack+".js", options);
        }
      }
    }

    private createFunction(
	    this: Library, 
	    name: string, 
	    callBack: (
		    args: Runtime[], 
		    env: Environment
	    ) => RuntimeValue
    ){
        if(this.env.devLookup(name) === undefined){
          this.env.declareVar(
		  name, 
		  makeNativeFn(callBack as FunctionCall), 
		  true
	  )
        }
          else
            new SkyScriptWarn(
		    `Can't create custom function with name '${name}'`
		    	+` cause it already exists`);
    }
    private createVariable(
	    this: Library,
	    name: string, 
	    value: any,
	    constant: boolean
    ){
        this.env.devLookup(name) === undefined 
          ? this.env.declareVar(name, value, constant)
          : new SkyScriptWarn(
		  `Can't create custom variable with name '${name}'`
		  	+` cause it already exists`);
    }
}
