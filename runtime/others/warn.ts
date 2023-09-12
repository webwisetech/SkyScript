import colors from 'npm:colors';

export class SkyScriptWarn {
	constructor(message: string | undefined){
		if(message === undefined){
			console.log(colors.cyan("An unknown error happened."))
			Deno.exit(1);
		}
		console.log(colors.cyan("Warning: ")+colors.yellow(message));
	}
}