import { NumberValue, StringValue, BooleanValue, NullValue } from "../runtime/val.js";
import util from 'node:util';
import { question } from 'readline-sync';
import { execSync } from "node:child_process";

export default ({ makeString, library, makeNull }) => {
    library.createFunction("out", (args, _scope) => {
        const log: any[] = []
    
        for (const arg of args) {
            switch (arg.type) {
                case 'number':
                    log.push(((arg as NumberValue).value))
                continue
                case 'string':
                    log.push((arg as StringValue).value)
                continue
                case 'boolean':
                    log.push(((arg as BooleanValue).value))
                continue
                case 'null':
                    log.push(((arg as NullValue).value))
                continue
                default:
                    log.push(arg)
            }
        }
            const be42log = util.format.apply(this, log);
            console.log(be42log)
    
        return makeString(be42log);
    });

    library.createFunction("ask", (args, _scope) => {
        const log: string[] = []
    
        for (const arg of args) {
            switch (arg.type) {
                case 'string':
                    log.push((arg as StringValue).value)
                continue
                default:
                    log.push(arg)
            }
        }

        return makeString(question(util.format.apply(this, log) || "> "));
    });

    library.createFunction("wait", function(args, _scope){
        const value = (args[0] as NumberValue).value;
        execSync(`sleep ${value}`, {});
        return makeNull();
    })
}