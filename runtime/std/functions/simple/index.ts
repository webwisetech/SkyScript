// Other imports //
import Environment from "../../../environment.ts";
import { MakeNativeFunc, ObjectValue, Runtime } from "../../../values.ts";
// time //
import now from './time/now.ts';
// process //
import exit from './process/exit.ts';
import exec from './process/exec.ts';
import mode from './process/mode.ts';
import loop from './process/loop.ts';
import wait from './process/wait.ts';
import ask from './process/ask.ts';
import out from './process/out.ts';
// math //
import nnei from "./math/nnei.ts";
// non-ready //
import nebula from "./non-ready/nebula.ts";
import pikala from "./non-ready/pikala.ts";
import yellowcat from "./non-ready/yellowcat.ts";
// colors //
import blue from "./colors/blue.ts";
import cyan from "./colors/cyan.ts";
import green from "./colors/green.ts";
import magenta from "./colors/magenta.ts";
import red from "./colors/red.ts";
import yellow from "./colors/yellow.ts";
// discord //
import bot from './discord/bot.ts';
import embed from './discord/embed.ts';
import ready from './discord/events/ready.ts';
import message from './discord/events/message.ts';

// maps //
// discord //
const map1 = new Map<string, Runtime>();
map1.set("ready", MakeNativeFunc(ready))
map1.set("message", MakeNativeFunc(message));

export default function(env: Environment){
	// time //
	env.declareVar("now", MakeNativeFunc(now), true);
	// process //
	env.declareVar("exit", MakeNativeFunc(exit), true);
	env.declareVar("run", MakeNativeFunc(exec), true);
	env.declareVar("mode", MakeNativeFunc(mode), true);
    env.declareVar("loop", MakeNativeFunc(loop), true);
	env.declareVar("wait", MakeNativeFunc(wait), true);
	env.declareVar("ask", MakeNativeFunc(ask), true);
	env.declareVar("out", MakeNativeFunc(out), true);
	// math //
	env.declareVar("nnei", MakeNativeFunc(nnei), true);
	// non-ready //
	env.declareVar("yellowcat", MakeNativeFunc(yellowcat), true);
    env.declareVar("nebula", MakeNativeFunc(nebula), true);
    env.declareVar("pikala", MakeNativeFunc(pikala), true);
	// colors //
	env.declareVar("blue", MakeNativeFunc(blue), true);
    env.declareVar("green", MakeNativeFunc(green), true);
    env.declareVar("red", MakeNativeFunc(red), true);
    env.declareVar("yellow", MakeNativeFunc(yellow), true);
    env.declareVar("cyan", MakeNativeFunc(cyan), true);
    env.declareVar("magenta", MakeNativeFunc(magenta), true);
	// discord //
	env.declareVar("bot", MakeNativeFunc(bot), true);
	env.declareVar("embed", MakeNativeFunc(embed), true);
	env.declareVar("events", { type: 'object', properties: map1 } as ObjectValue, true);
}