out("Welcome to the SkyScript test menu!") // output the text //
out("[1]: Start the SkyScript Bot") // output the text //
out("[2+]: Exit") // output the text //

lock option = ask("Option: ") // ask for input //

if(option == "1"){
	run("bot.ss") // if 1 is given, start the bot //
} else {
	out("Exiting...") // else, exit the process //
	exit(0)
}