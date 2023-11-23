import type { Message, Client } from "npm:discord.js";

export const memory: {
	client?: Client<boolean>;
	message?: Message<true>;
	strict?: boolean;
	modules?: {
		"discord.ss": boolean;
		"colors": boolean;
		"nostrict": boolean; 
	}
} = {};