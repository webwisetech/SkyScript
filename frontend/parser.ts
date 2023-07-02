import {  Stmt, Expression, BinaryExpression, Program, NumericLiteral, Identifier, VarDeclaration } from './ast.ts';
import { Tokenize, Token, TokenType } from './lexer.ts';

export default class Parser {
    private tokens: Token[] = [];

    private not_eof(): boolean {
        return this.tokens[0].type != TokenType.EOF;
    }

    private at() {
        return this.tokens[0] as Token;
    } 

    private next(){
        const prev = this.tokens.shift() as Token;

        return prev;
    }

    private expect(type: TokenType, err: string){
        const prev = this.tokens.shift() as Token;
        if(!prev || prev.type != type){
            console.error("Compiler Error:\n", err, prev, "Expecting: ", type);
            Deno.exit(1);
        }

        return prev;
    }

    public produceAST(sourceCode: string): Program {
        this.tokens = Tokenize(sourceCode);
        const program: Program = {
            kind: "Program",
            body: []
        };

        while(this.not_eof()){
            program.body.push(this.parse_stmt());
        }

        return program;
    }

    private parse_stmt(): Stmt {
        switch(this.at().type){
            case TokenType.Set:
            case TokenType.Lock:
                return this.parse_var_declaration();
            default:
                return this.parse_expr();
        }
    }
    private parse_var_declaration(): Stmt {
    const isConstant = this.next().type == TokenType.Lock;
    const ident = this.expect(TokenType.Identifier, `Expected An identifier at a variable declaration`).value;

    if(this.at().type == TokenType.Exclamation){
        this.next();
        if(isConstant) throw "cannot lock undefined";
        return {
            kind: "VarDeclaration",
            identifier: ident,
            constant: false
        } as VarDeclaration;
    }
    this.expect(TokenType.Equals, "No Equals sign found in declaration");

    const declaration = { 
        kind: "VarDeclaration",
        value: this.parse_expr(),
        identifier: ident,
        constant: isConstant
         } as VarDeclaration;
    this.expect(TokenType.Exclamation, "var declarations must end with exclamation marks");
    return declaration;
}

    private parse_expr(): Expression {
        return this.parse_additive_expr();
    }

    private parse_additive_expr(): Expression {
        let left = this.parse_multiplicative_expr();

        while(this.at().value == "+" ||  this.at().value == "-"){
            const operator = this.next().value;
            const right = this.parse_multiplicative_expr();
            left = {
                kind: "BinaryExpression",
                left,
                right,
                operator 
            } as BinaryExpression;
        }
        return left;
    }

    private parse_multiplicative_expr(): Expression {
        let left = this.parse_primary_expr();

        while(this.at().value == "/" ||  this.at().value == "*"){
            const operator = this.next().value;
            const right = this.parse_primary_expr();
            left = {
                kind: "BinaryExpression",
                left,
                right,
                operator 
            } as BinaryExpression;
        }
        return left;
    }

    private parse_primary_expr(): Expression {
        const tk = this.at().type;

        switch(tk){
            case TokenType.Identifier:
                return { kind: "Identifier", symbol: this.next().value } as Identifier;
            case TokenType.Number:
                return { kind: "NumericLiteral", value: parseFloat(this.next().value) } as NumericLiteral;
            
            case TokenType.OpenParen: {
                this.next();
                const value = this.parse_expr();
                this.expect(TokenType.CloseParen, "You Forgot A Closing Parenthisis");
                return value;
            }
            default:
                console.error("Unknown Token found at:", this.at());
                Deno.exit(1);
        }
    }
}