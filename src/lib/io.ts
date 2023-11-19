import { NumberValue, StringValue, BooleanValue, NullValue } from "../runtime/val.js";
import util from 'node:util';
import { question } from 'readline-sync';
import { run } from "../index.js";

export default ({ makeString, library }) => {
    library.createFunction("exit", (args, _scope) => {
        let exitCode: number;

            switch (args[0].type) {
                case 'string':
                    exitCode = (args[0] as NumberValue).value
                default:
                    exitCode = args[0]
            }

        process.exit(exitCode);
    })
    library.createFunction("run", (args, _scope) => {
        let file = "error";

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

        run(file);
    })
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
}