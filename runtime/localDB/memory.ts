import type { Message, Client } from "npm:discord.js";

export const memory: {
	client?: Client<boolean>
	message?: Message<true> 
} = {};