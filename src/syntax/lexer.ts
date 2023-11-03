import { SkyScriptErr } from "../util/error";

export enum typeOfToken {
	Number,
	Identifier,
	String,
	BinaryOperator,
	Equals,
	BinaryEquals,
	DoubleEquals,
	NotEquals,
	Comma,
	Dot,
	Colon,
	Semicolon,
	OpenParen, 
	CloseParen, 
	OpenBrace, 
	CloseBrace,
    OpenBracket, 
	CloseBracket,
	GreaterThanSign,
	Slash,
	Set,
	Lock,
	Fun,
	If,
	Else,
	While,
	For,
	Return,
	Break,
	Async,
	From,
	Take,
	Give,
	Using,
	EOF,
}

const KEYWORDS: Record<string, typeOfToken> = {
	set: typeOfToken.Set, // implemented
	lock: typeOfToken.Lock, // implemented
	fun: typeOfToken.Fun, // implemented
	if: typeOfToken.If, // implemented
	else: typeOfToken.Else, // implemented
	for: typeOfToken.For, // not implemented
	while: typeOfToken.While, // deprecated cause of loop()
	return: typeOfToken.Return, // not implemented
	break: typeOfToken.Break, // not implemented
	async: typeOfToken.Async, // not implemented
	take: typeOfToken.Take, // not implemented - similar to "import" in typescript
	from: typeOfToken.From, // not implemented - similar to "from" in typescript
	give: typeOfToken.Give, // not implemented - similar to "export" in typescript
	using: typeOfToken.Using // implemented
};

export interface Token {
	value: string;
	type: typeOfToken;
}

function tokenize(value = "", type: typeOfToken): Token {
	return { value, type };
}

function isAlphabetic(src: string) {
	return src.toUpperCase() != src.toLowerCase();
}

function isSkippable(str: string) {
	return str == " " || str == "\n" || str == "\t" || str == "\r" || str == ";" || str == "/";
}

function isNumber(str: string) {
	const c = str.charCodeAt(0);
	const bounds = ["0".charCodeAt(0), "9".charCodeAt(0)];
	return c >= bounds[0] && c <= bounds[1];
}

export function setupTokens(sourceCode: string): Token[] {
	const tokens = new Array<Token>();
	const src = sourceCode.split("");

	while (src.length > 0) {
		let sc = src[0];
	switch(src[0]){
		case "(":
			tokens.push(tokenize(src.shift(), typeOfToken.OpenParen));
		break;
		case ")":
			tokens.push(tokenize(src.shift(), typeOfToken.CloseParen));
		break;
		case "{":
			tokens.push(tokenize(src.shift(), typeOfToken.OpenBrace));
		break;
		case "}":
			tokens.push(tokenize(src.shift(), typeOfToken.CloseBrace));
		break;
		case "[":
			tokens.push(tokenize(src.shift(), typeOfToken.OpenBracket));
		break;
		case "]":
			tokens.push(tokenize(src.shift(), typeOfToken.CloseBracket));
		break;
		case "+":
			switch(src[1]){
				case "+":
					src.shift();
					tokens.push(tokenize(src.shift() + "+", typeOfToken.BinaryOperator));
				break;
				case "=":
					tokens.push(tokenize(src.shift() + "=", typeOfToken.BinaryOperator));
					src.shift();
				break;
				default:
					tokens.push(tokenize(src.shift(), typeOfToken.BinaryOperator));
				break;
			} 
		break;
		case "-":
			switch(src[1]){
				case "-":
					src.shift();
					tokens.push(tokenize(src.shift() + "-", typeOfToken.BinaryOperator));
				break;
				case "=":
					tokens.push(tokenize(src.shift() + "=", typeOfToken.BinaryOperator));
					src.shift();
				break;
				default: 
					tokens.push(tokenize(src.shift(), typeOfToken.BinaryOperator));
				break;
			} 
		break;
		case "*":
			switch(src[1]){
				case "=":
					tokens.push(tokenize(src.shift() + "=", typeOfToken.BinaryOperator));
					src.shift();
				break;
				default:
					tokens.push(tokenize(src.shift(), typeOfToken.BinaryOperator));
				break;
			}
		break;
		case "/":
			switch(src[1]){
				case "=":
					tokens.push(tokenize(src.shift() + "=", typeOfToken.BinaryOperator));
					src.shift();
				break;
				case "/":
					tokens.push(tokenize(src.shift()+'/', typeOfToken.Slash));
					src.shift();
				break;
				default:
					tokens.push(tokenize(src.shift(), typeOfToken.BinaryOperator));
				break;
			}
		break;
		case "%":
			switch(src[1]){
				case "=":
					tokens.push(tokenize(src.shift() + "=", typeOfToken.BinaryOperator));
					src.shift();
				break;
				default:
					tokens.push(tokenize(src.shift(), typeOfToken.BinaryOperator));
				break;
			}
		break;
		case "=":
			switch(src[1]){
				case "=":
					src.shift();
					src.shift();
					tokens.push(tokenize("==", typeOfToken.DoubleEquals));
				break;
				default:
					tokens.push(tokenize(src.shift(), typeOfToken.Equals));
				break;
			}
		break;
		case "!":
			switch(src[1]) {
				case "=":
					src.shift();
                	src.shift();
                	tokens.push(tokenize('!=', typeOfToken.NotEquals));
				break;
				default: break;
            }
		break;
		case ";":
			tokens.push(tokenize(src.shift(), typeOfToken.Semicolon));
		break;
		case ":":
			tokens.push(tokenize(src.shift(), typeOfToken.Colon));
		break;
		case ",":
			tokens.push(tokenize(src.shift(), typeOfToken.Comma));
		break;
		case ".":
			tokens.push(tokenize(src.shift(), typeOfToken.Dot));
		break;
		case '"':
		case "'":{
				src.shift()
            let string = ''

            while (src.length > 1 && src[0] != '"') {
                string += src.shift()
            }

            src.shift()
            tokens.push(tokenize(string, typeOfToken.String))
			} break;
		case ">": {
			switch(src[1]){
				case ">":
					while (src.length > 0 && sc != "\r" && sc != "\n") {
						src.shift();
						sc = src[0];
					}
				break;
				default: break;
			}
		} break;
		default: {
			let a: string;
			if (isNumber(src[0])) { a = "int"} else if (isAlphabetic(src[0])) { a = "alpha" } else if (isSkippable(src[0])) { a = "skippable"} else { a = "other" }
			switch(a){
				case "int": {
					let num = "";
					while (src.length > 0 && isNumber(src[0])) {
						num += src.shift();
					}
					tokens.push(tokenize(num, typeOfToken.Number));
				} break;
				case "alpha": {
					let ident = "";
				while (src.length > 0 && isAlphabetic(src[0]) || isNumber(src[0])) {
					ident += src.shift();
				}
				const reserved = KEYWORDS[ident];
				if (typeof reserved == "number") {
					tokens.push(tokenize(ident, reserved));
				} else {
					tokens.push(tokenize(ident, typeOfToken.Identifier));
				} 
				} break;
				case "skippable":
					src.shift(); 
				break;
				default:
					new SkyScriptErr(
						"Unreconized character found in source: " +src[0].charCodeAt(0) +"\n"+src[0]
					);
				break;
			}
		} break;
	}
	}

	tokens.push({ type: typeOfToken.EOF, value: "EndOfFile" });
	return tokens;
}