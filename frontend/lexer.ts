export enum TokenType {
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
	// keywords 
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
	EOF,
}

const KEYWORDS: Record<string, TokenType> = {
	set: TokenType.Set,
	lock: TokenType.Lock,
	fun: TokenType.Fun,
	if: TokenType.If,
	else: TokenType.Else,
	for: TokenType.For,
	while: TokenType.While,
	return: TokenType.Return,
	break: TokenType.Break,
	async: TokenType.Async
};

export interface Token {
	value: string;
	type: TokenType;
}

function token(value = "", type: TokenType): Token {
	return { value, type };
}

function isalpha(src: string) {
	return src.toUpperCase() != src.toLowerCase();
}

function isskippable(str: string) {
	return str == " " || str == "\n" || str == "\t" || str == "\r";
}

function isint(str: string) {
	const c = str.charCodeAt(0);
	const bounds = ["0".charCodeAt(0), "9".charCodeAt(0)];
	return c >= bounds[0] && c <= bounds[1];
}

export function tokenize(sourceCode: string): Token[] {
	const tokens = new Array<Token>();
	const src = sourceCode.split("");

	while (src.length > 0) {
		let sc = src[0];
	switch(src[0]){
		case "(":
			tokens.push(token(src.shift(), TokenType.OpenParen));
		break;
		case ")":
			tokens.push(token(src.shift(), TokenType.CloseParen));
		break;
		case "{":
			tokens.push(token(src.shift(), TokenType.OpenBrace));
		break;
		case "}":
			tokens.push(token(src.shift(), TokenType.CloseBrace));
		break;
		case "[":
			tokens.push(token(src.shift(), TokenType.OpenBracket));
		break;
		case "]":
			tokens.push(token(src.shift(), TokenType.CloseBracket));
		break;
		case "+":
			switch(src[1]){
				case "+":
					src.shift();
					tokens.push(token(src.shift() + "+", TokenType.BinaryOperator));
				break;
				case "=":
					tokens.push(token(src.shift() + "=", TokenType.BinaryOperator));
					src.shift();
				break;
				default:
					tokens.push(token(src.shift(), TokenType.BinaryOperator));
				break;
			} 
		break;
		case "-":
			switch(src[1]){
				case "-":
					src.shift();
					tokens.push(token(src.shift() + "-", TokenType.BinaryOperator));
				break;
				case "=":
					tokens.push(token(src.shift() + "=", TokenType.BinaryOperator));
					src.shift();
				break;
				default: 
					tokens.push(token(src.shift(), TokenType.BinaryOperator));
				break;
			} 
		break;
		case "*":
			switch(src[1]){
				case "=":
					tokens.push(token(src.shift() + "=", TokenType.BinaryOperator));
					src.shift();
				break;
				default:
					tokens.push(token(src.shift(), TokenType.BinaryOperator));
				break;
			}
		break;
		case "/":
			switch(src[1]){
				case "=":
					tokens.push(token(src.shift() + "=", TokenType.BinaryOperator));
					src.shift();
				break;
				default:
					tokens.push(token(src.shift(), TokenType.BinaryOperator));
				break;
			}
		break;
		case "%":
			switch(src[1]){
				case "=":
					tokens.push(token(src.shift() + "=", TokenType.BinaryOperator));
					src.shift();
				break;
				default:
					tokens.push(token(src.shift(), TokenType.BinaryOperator));
				break;
			}
		break;
		case "=":
			switch(src[1]){
				case "=":
					src.shift();
					src.shift();
					tokens.push(token("==", TokenType.DoubleEquals));
				break;
				default:
					tokens.push(token(src.shift(), TokenType.Equals));
				break;
			}
		break;
		case "!":
			switch(src[1]) {
				case "=":
					src.shift();
                	src.shift();
                	tokens.push(token('!=', TokenType.NotEquals));
				break;
				default: break;
            }
		break;
		case ";":
			tokens.push(token(src.shift(), TokenType.Semicolon));
		break;
		case ":":
			tokens.push(token(src.shift(), TokenType.Colon));
		break;
		case ",":
			tokens.push(token(src.shift(), TokenType.Comma));
		break;
		case ".":
			tokens.push(token(src.shift(), TokenType.Dot));
		break;
		case '"':
		case "'":{
				src.shift()
            let string = ''

            while (src.length > 1 && src[0] != '"') {
                string += src.shift()
            }

            src.shift()
            tokens.push(token(string, TokenType.String))
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
			if (isint(src[0])) { a = "int"} else if (isalpha(src[0])) { a = "alpha" } else if (isskippable(src[0])) { a = "skippable"} else { a = "other" }
			switch(a){
				case "int": {
					let num = "";
					while (src.length > 0 && isint(src[0])) {
						num += src.shift();
					}
					tokens.push(token(num, TokenType.Number));
				} break;
				case "alpha": {
					let ident = "";
				while (src.length > 0 && isalpha(src[0])) {
					ident += src.shift();
				}
				const reserved = KEYWORDS[ident];
				if (typeof reserved == "number") {
					tokens.push(token(ident, reserved));
				} else {
					tokens.push(token(ident, TokenType.Identifier));
				} 
				} break;
				case "skippable":
					src.shift(); 
				break;
				default:
					console.error(
						"Unreconized character found in source: ",
						src[0].charCodeAt(0),
						src[0]
					);
					Deno.exit(1);
				break;
			}
		} break;
	}
	}

	tokens.push({ type: TokenType.EOF, value: "EndOfFile" });
	return tokens;
}