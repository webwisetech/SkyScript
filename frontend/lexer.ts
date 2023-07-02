export enum TokenType {
    Number, 
    Identifier,
    Equals,
    Exclamation,
    Comma, Colon,
    OpenParen, 
    CloseParen,
    LSlash, RSlash,
    LBracket, RBracket,
    LBrace, RBrace,
    BinaryOperator,
    Set,
    Lock,
    EOF,
}

const keywords: Record<string, TokenType> = {
    "set": TokenType.Set,
    "lock": TokenType.Lock
};

export interface Token {
    value: string;
    type: TokenType;
}
function token(value= "", type: TokenType): Token {
return { value, type };
}
function isAlpha(src: string){
    return src.toUpperCase() != src.toLowerCase();
}
function isInt(src: string){
    const c = src.charCodeAt(0);
    const bounds = ["0".charCodeAt(0), "9".charCodeAt(0)];
    return (c >= bounds[0] && c <= bounds[1]);
}
function isSkippable(str: string) {
    return str == ' ' || str == '\n' || str == '\t' || str == `
`
}

export function Tokenize(src: string): Token[] {
    const tokens = new Array<Token>();
    const sc = src.split("");

    while(sc.length > 0){
        if(sc[0] == "("){
            tokens.push(token(sc.shift(), TokenType.OpenParen));
        } else if(sc[0] == ")"){
            tokens.push(token(sc.shift(), TokenType.CloseParen));
        } else if(sc[0] == "/"){
            tokens.push(token(sc.shift(), TokenType.LSlash));
        } else if(sc[0] == "\\"){
            tokens.push(token(sc.shift(), TokenType.RSlash));
        } else if(sc[0] == "["){
            tokens.push(token(sc.shift(), TokenType.LBrace));
        } else if(sc[0] == "]"){
            tokens.push(token(sc.shift(), TokenType.RBrace));
        } else if(sc[0] == "{"){
            tokens.push(token(sc.shift(), TokenType.LBracket));
        } else if(sc[0] == "}"){
            tokens.push(token(sc.shift(), TokenType.RBracket));
        } else if(sc[0] == "+" || sc[0] == "-" || sc[0] == "*" || sc[0] == "/"){
            tokens.push(token(sc.shift(), TokenType.BinaryOperator));
        } else if(sc[0] == "="){
            tokens.push(token(sc.shift(), TokenType.Equals));
        } else if(sc[0] == "!"){
            tokens.push(token(sc.shift(), TokenType.Exclamation));
        } else if(sc[0] == ":"){
            tokens.push(token(sc.shift(), TokenType.Colon));
        } else if(sc[0] == ","){
            tokens.push(token(sc.shift(), TokenType.Comma));
        } else {

            if(isInt(sc[0])){
                let num = "";
                while(sc.length > 0 && isInt(sc[0])){
                    num += sc.shift();
                }
                
                tokens.push(token(num, TokenType.Number));
            } else if(isAlpha(sc[0])){
                let ident = "";
                while(sc.length > 0 && isAlpha(sc[0])){
                    ident += sc.shift();
                }

                // checks
                const res = keywords[ident];

                if(typeof res != "number"){
                    tokens.push(token(ident, TokenType.Identifier));
                } else {
                    tokens.push(token(ident, res));
                }
            } else if(isSkippable(sc[0])){
                sc.shift();
            } else {
                console.log(`unknown char found: ${sc[0]}`);
                console.log("exiting");
                Deno.exit(1);
            }
        }
    }

    tokens.push({ type: TokenType.EOF, value: "EndOfFile" });

    return tokens;
}