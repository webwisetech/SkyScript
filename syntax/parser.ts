// deno-lint-ignore-file no-explicit-any prefer-const
import {
	AssignmentExpression,
	BinaryExpression,
	CallExpression,
	Expression,
	Identifier,
	MemberExpression,
	NumericLiteral,
	ObjectLiteral,
	Program,
	Property,
	Statement,
	VarDeclaration,
	FunctionDeclaration,
StringLiteral,
IfStatement,
EqualityExpression,
} from "./ast.ts";

import { Token, setupTokens, typeOfToken } from "./lexer.ts";

export default class Parser {
	private tokens: Token[] = [];

	private isNotEOF(): boolean {
		return this.tokens[0].type != typeOfToken.EOF;
	}

	private currentToken() {
		return this.tokens[0] as Token;
	}

	private nextToken() {
		const prev = this.tokens.shift() as Token;
		return prev;
	}

	private ensureToken(type: typeOfToken, err: any) {
		const prev = this.tokens.shift() as Token;
		if (!prev || prev.type != type) {
			console.error("Parser Error:\n", err, prev, " - Expecting: ", type);
			Deno.exit(1);
		}

		return prev;
	}

	public createAST(sourceCode: string): Program {
		this.tokens = setupTokens(sourceCode);
		const program: Program = {
			kind: "Program",
			body: [],
		};

		// Parse until end of file
		while (this.isNotEOF()) {
			program.body.push(this.parse_Statement());
		}

		return program;
	}

	// Handle complex statement types
	private parse_Statement(): Statement {
		// skip to parse_Expression
		switch (this.currentToken().type) {
			case typeOfToken.Using:
				return this.parse_using_modules();
			case typeOfToken.Slash:
				return this.parse_comments();
			case typeOfToken.Set:
			case typeOfToken.Lock:
				return this.parse_var_declaration();
			case typeOfToken.Fun:
				return this.parse_fn_declaration();
			case typeOfToken.If:
				return this.parse_if_Statement();
			default:
				return this.parse_Expression();
		}
	}

	/*private async addModule(module: string): Promise<void>{
		type modules = "discord.ss" | "colors.ss";
		const mods = await db.get("modules") as modules[] | [] as modules[];
		if(!["discord.ss", "colors.ss"].includes(module)) throw "are you sure you didn't forget something?";
		mods.push(module as never);
		await db.set("modules", mods);
	}*/

	private parse_using_modules(): Statement{
		this.nextToken()
		this.ensureToken(typeOfToken.String, "No module found after the using keyword");
		
		return { kind: "NumericLiteral", value: 0 } as NumericLiteral;
	}
	private parse_comments(): Statement {
		this.nextToken()
		while(this.nextToken().type != typeOfToken.Slash && this.isNotEOF()){
			continue;
		}
		return { kind: 'NumericLiteral', value: 0 } as NumericLiteral;
	}

	private parse_if_Statement(): IfStatement {
        this.ensureToken(typeOfToken.If, 'Expected "if" keyword.');
        const conditional = this.parse_Expression();
        const consequent: Statement[] = [];
        let right: Expression = {} as Expression;
        let operator: typeOfToken =typeOfToken.BinaryEquals;

        this.ensureToken(typeOfToken.OpenBrace, 'Expected opening brace for consequent block.');

        while (this.currentToken().type !== typeOfToken.EOF && this.currentToken().type !== typeOfToken.CloseBrace) {
            consequent.push(this.parse_Statement());
        }
      
        this.ensureToken(typeOfToken.CloseBrace, 'Expected closing brace for consequent block.');
      
        let alternate: Statement[] | undefined = undefined;
      
        if (this.currentToken().type === typeOfToken.Else) {
          this.nextToken();
      
          if (this.currentToken().type === typeOfToken.If) {
            alternate = [this.parse_if_Statement()];
          } else {
            alternate = [];
      
            this.ensureToken(typeOfToken.OpenBrace, 'Expected opening brace for alternate block.');
      
            while (this.currentToken().type !== typeOfToken.EOF && this.currentToken().type !== typeOfToken.CloseBrace) {
              alternate.push(this.parse_Statement())
            }
      
            this.ensureToken(typeOfToken.CloseBrace, 'Expected closing brace for alternate block.');
          }
        }
        return {
          kind: 'IfStatement',
          conditional,
          operator,
          right,
          consequent,
          alternate,
        } as IfStatement
      }

	private parse_fn_declaration(): Statement {
		this.nextToken(); // eat fn keyword
		const name = this.ensureToken(
			typeOfToken.Identifier,
			"Expected function name following fn keyword"
		).value;

		const args = this.parse_args();
		const params: string[] = [];
		for (const arg of args) {
			if (arg.kind !== "Identifier") {
				console.log(arg);
				throw "Inside function declaration expected parameters to be of type string.";
			}

			params.push((arg as Identifier).symbol);
		}

		this.ensureToken(
			typeOfToken.OpenBrace,
			"Expected function body following declaration"
		);
		const body: Statement[] = [];

		while (
			this.currentToken().type !== typeOfToken.EOF &&
			this.currentToken().type !== typeOfToken.CloseBrace
		) {
			body.push(this.parse_Statement());
		}

		this.ensureToken(
			typeOfToken.CloseBrace,
			"Closing brace expected inside function declaration"
		);

		const fn = {
			body,
			name,
			parameters: params,
			kind: "FunctionDeclaration",
		} as FunctionDeclaration;

		return fn;
	}

	parse_var_declaration(): Statement {
		const isConstant = this.nextToken().type == typeOfToken.Lock;
		const identifier = this.ensureToken(
			typeOfToken.Identifier,
			"Expected identifier name following let | const keywords."
		).value;

		if (this.currentToken().type == typeOfToken.Semicolon) {
			this.nextToken(); // expect semicolon
			if (isConstant) {
				throw "Must assign a value to constant Expressionession. No value provided.";
			}

			return {
				kind: "VarDeclaration",
				identifier,
				constant: false,
			} as VarDeclaration;
		}

		this.ensureToken(
			typeOfToken.Equals,
			"Expected equals token following identifier in var declaration."
		);

		const declaration = {
			kind: "VarDeclaration",
			value: this.parse_Expression(),
			identifier,
			constant: isConstant,
		} as VarDeclaration;

		return declaration;
	}

	// Handle Expressionessions
	private parse_Expression(): Expression {
		return this.parse_assignment_Expression();
	}

	private parse_assignment_Expression(): Expression {
		const left = this.parse_object_Expression();

		if (this.currentToken().type == typeOfToken.Equals) {
			this.nextToken(); // advance past equals
			const value = this.parse_assignment_Expression();
			return { value, assigne: left, kind: "AssignmentExpression" } as AssignmentExpression;
		}

		return left;
	}

	private parse_object_Expression(): Expression {
		// { Prop[] }
		if (this.currentToken().type !== typeOfToken.OpenBrace) {
			return this.parse_additive_Expression();
		}

		this.nextToken(); // advance past open brace.
		const properties = new Array<Property>();

		while (this.isNotEOF() && this.currentToken().type != typeOfToken.CloseBrace) {
			const key = this.ensureToken(
				typeOfToken.Identifier,
				"Object literal key expected"
			).value;

			// Allows shorthand key: pair -> { key, }
			if (this.currentToken().type == typeOfToken.Comma) {
				this.nextToken(); // advance past comma
				properties.push({ key, kind: "Property" } as Property);
				continue;
			} // Allows shorthand key: pair -> { key }
			else if (this.currentToken().type == typeOfToken.CloseBrace) {
				properties.push({ key, kind: "Property" });
				continue;
			}

			// { key: val }
			this.ensureToken(
				typeOfToken.Colon,
				"Missing colon following identifier in ObjectExpression"
			);
			const value = this.parse_Expression();

			properties.push({ kind: "Property", value, key });
			if (this.currentToken().type != typeOfToken.CloseBrace) {
				this.ensureToken(
					typeOfToken.Comma,
					"Expected comma or closing bracket following property"
				);
			}
		}

		this.ensureToken(typeOfToken.CloseBrace, "Object literal missing closing brace.");
		return { kind: "ObjectLiteral", properties } as ObjectLiteral;
	}

	// Handle Addition & Subtraction Operations
	private parse_additive_Expression(): Expression {
		let left = this.parse_multiplicitave_Expression();

		while (this.currentToken().value == "+" || this.currentToken().value == "-" && this.isNotEOF()) {
			const operator = this.nextToken().value;

			const right = this.parse_multiplicitave_Expression();
			left = {
				kind: "BinaryExpression",
				left,
				right,
				operator,
			} as BinaryExpression;
		}

		return left;
	}

	private parse_multiplicitave_Expression(): Expression {
		let left = this.parse_call_member_Expression();

		while ( ["/", "*", "%"].includes(this.currentToken().value) ){
			const operator = this.nextToken().value;
		
			const right = this.parse_call_member_Expression();
			left = {
				kind: "BinaryExpression",
				left,
				right,
				operator,
			} as BinaryExpression;
		}

		return left;
	}

	private parse_call_member_Expression(): Expression {
		const member = this.parse_member_Expression();

		if (this.currentToken().type == typeOfToken.OpenParen) {
			return this.parse_call_Expression(member);
		}

		return member;
	}

	private parse_call_Expression(caller: Expression): Expression {
		let call_Expression: Expression = {
			kind: "CallExpression",
			caller,
			args: this.parse_args(),
		} as CallExpression;

		if (this.currentToken().type == typeOfToken.OpenParen) {
			call_Expression = this.parse_call_Expression(call_Expression);
		}

		return call_Expression;
	}

	private parse_args(): Expression[] {
		this.ensureToken(typeOfToken.OpenParen, "Expected open parenthesis");
		const args =
			this.currentToken().type == typeOfToken.CloseParen ? [] : this.parse_arguments_list();

		this.ensureToken(
			typeOfToken.CloseParen,
			"Missing closing parenthesis inside arguments list"
		);
		return args;
	}

	private parse_arguments_list(): Expression[] {
		const args = [this.parse_assignment_Expression()];

		while (this.currentToken().type == typeOfToken.Comma && this.nextToken()) {
			args.push(this.parse_assignment_Expression());
		}

		return args;
	}

	private parse_member_Expression(): Expression {
		let object = this.parse_primary_Expression();

		while (
			this.currentToken().type == typeOfToken.Dot ||
			this.currentToken().type == typeOfToken.OpenBracket
		) {
			const operator = this.nextToken();
			let property: Expression;
			let computed: boolean;

			if (operator.type == typeOfToken.Dot) {
				computed = false;
				property = this.parse_primary_Expression();
				if (property.kind != "Identifier") {
					throw `Cannonot use dot operator without right hand side being a identifier`;
				}
			} else {
				computed = true;
				property = this.parse_Expression();
				this.ensureToken(
					typeOfToken.CloseBracket,
					"Missing closing bracket in computed value."
				);
			}

			object = {
				kind: "MemberExpression",
				object,
				property,
				computed,
			} as MemberExpression;
		}

		return object;
	}

	private parse_primary_Expression(): Expression {
		const tk = this.currentToken().type;

		switch (tk) {
			case typeOfToken.Slash:
				return { kind: "NumericLiteral", value: 0 } as NumericLiteral;
			case typeOfToken.Identifier:
				return { kind: "Identifier", symbol: this.nextToken().value } as Identifier;

			case typeOfToken.Number:
				return {
					kind: "NumericLiteral",
					value: parseFloat(this.nextToken().value),
				} as NumericLiteral;

			case typeOfToken.String:
				return { kind: 'StringLiteral', value: this.nextToken().value } as StringLiteral;
			case typeOfToken.OpenParen: {
				this.nextToken(); 
				const left = this.parse_Expression();
				let right: Expression;
				let value: Expression;
				let operator: typeOfToken;
				if (this.currentToken().type == typeOfToken.DoubleEquals || this.currentToken().type == typeOfToken.NotEquals) {
                    operator = this.nextToken().type
                    right = this.parse_Expression()
                    value = { kind: 'EqualityExpression', left, operator, right } as EqualityExpression
                } else {
                    value = left
                }
				this.ensureToken(
					typeOfToken.CloseParen,
					"Unexpected token found inside parenthesised Expressionession. Expected closing parenthesis."
				); 
				return value;
			}

			default:
				console.error("Unexpected token found during parsing!", this.currentToken());
				Deno.exit(1);
		}
	}
}
