if(typeof module == "object") {
   TokenType = require('../Lexer/TokenType.js');
   keywords = require('../Lexer/Keywords.js');
}

const NodeTypes = {
    Program: 'Program',
    VariableDeclaration: 'VariableDeclaration',
    VariableDeclarator: 'VariableDeclarator',
    Identifier: 'Identifier',
    Literal: 'Literal',
    AssignmentExpression: 'AssignmentExpression',
    BinaryExpression: 'BinaryExpression',
    UnaryExpression: 'UnaryExpression',
    ObjectExpression: 'ObjectExpression',
    PrintStatement: 'PrintStatement',
    IfStatement: 'IfStatement',
    BlockStatement: 'BlockStatement',
    GroupingExpression: 'GroupingExpression',
    ForStatement: 'ForStatement',
    BreakStatement: 'BreakStatement',
    SkipStatement: 'SkipStatement',
    WhileStatement: 'WhileStatement',
    LogicalExpression: 'LogicalExpression',
    CallExpression: 'CallExpression',
    FunctionDeclaration: 'FunctionDeclaration',
    ReturnStatement: 'ReturnStatement',
    ArrayExpression: 'ArrayExpression',
    MemberExpression: 'MemberExpression',
    DotExpression: 'DotExpression',
    ClassDeclaration: 'ClassDeclaration',
    MethodDeclaration: 'MethodDeclaration',
    ThisExpression: 'ThisExpression',
    NewExpression: 'NewExpression'
}

class Parser {
    constructor(tokens) {
        this.tokens = tokens;
        this.ast = [];
        this.current = 0;
    }

    eof() {
        return this.current >= this.tokens.length || this.tokens[this.current].type === TokenType.EOF;
    }

    next() {
        return this.tokens[this.current++];
    }

    peek() {
        return this.tokens[this.current];
    }

    previous() {
        return this.tokens[this.current - 1];
    }

    peekNext() {
        if (this.tokens.length < 2) return null;
        return this.tokens[this.current + 1];
    }

    check(type) {
        if (this.eof()) return false;
        return this.peek().type === type;
    }

    match(...types) {
        for (let type of types) {
            if (this.check(type)) {
                this.next();
                return true;
            }
        }
        return false;
    }

    consume(type, message) {
        if (this.check(type)) return this.next();
        this.error(this.peek(), message)
    }

    error(token, message) {
        throw new Error(`Error at line ${token.line} : ${token.start} - ${token.end}: ${message}`);
    }


    //experimental code below this point

    /*
        expression     → assignment ;
        assignment     → IDENTIFIER "=" assignment | logic_or ;
        logic_or       → logic_and ( "or" logic_and )* ;
        logic_and      → equality ( "and" equality )* ;
        equality       → comparison ( ( "!=" | "==" ) comparison )* ;
        comparison     → addition ( ( ">" | ">=" | "<" | "<=" ) addition )* ;
        addition       → multiplication ( ( "-" | "+" ) multiplication )* ;
        multiplication → unary ( ( "/" | "*" ) unary )* ;
        unary          → ( "!" | "-" ) unary | call | Arraymember;
        call           → primary ( "(" arguments? ")" )* ;
        arguments      → expression ( "," expression )* ;
        primary        → NUMBER | STRING | "false" | "true" | "nil" | "(" expression ")" | IDENTIFIER | function-call ;
    */

    // Recursive descent parsing

    primary() {
        if (this.isLiteral(this.peek())) {
            let token = this.next();
            return {
                type: NodeTypes.Literal,
                value: token.value,
                string: token.string
            }
        } else if (this.match(TokenType.L_PAREN)) {
            let expr = {
                type: NodeTypes.GroupingExpression,
                Expression: this.parseExpression()
            };
            this.consume(TokenType.R_PAREN, 'Expected \')\'.');
            return expr;
        }

        if (this.match(TokenType.IDENTIFIER)) {
            return {
                type: NodeTypes.Identifier,
                name: this.previous().string
            }
        } else if (this.match(TokenType.THIS)) {
            return {
                type: NodeTypes.ThisExpression,
                name: this.previous().string
            }
        } else if (this.match(TokenType.L_SQUARE_BRACE)) {
            return this.array();
        } else if (this.match(TokenType.NEW)) {
            return this.newExpression();
        }

        this.error(this.peek(), 'Unexpected Token ' + this.peek().type);
    }

    newExpression() {
        let node = this.call();
        if (node.type != NodeTypes.CallExpression) this.error(this.previous(), 'Expected call expression.');
        node.type = NodeTypes.NewExpression;
        return node;
    }

    array() {
        let node = {
            type: NodeTypes.ArrayExpression,
            elements: []
        }

        while (!this.match(TokenType.R_SQUARE_BRACE)) {
            node.elements.push(this.parseExpression());
            if (this.match(TokenType.R_SQUARE_BRACE)) break;
            this.consume(TokenType.COMMA, 'Expected \',\'.');
        }
        
        //this.consume(TokenType.SEMICOLON, 'Expected \';\' after array expression');
        return node;
    }


    member(expr) {
        expr = {
            type: NodeTypes.MemberExpression,
            object: expr,
            property: this.unary()
        }

        this.consume(TokenType.R_SQUARE_BRACE, 'Expected \']\'.');
        return expr;
    }

    call() {
        let expr = this.primary();

        if (this.match(TokenType.L_PAREN)) {
            expr = {
                type: NodeTypes.CallExpression,
                callee: expr,
                args: []
            }

            while (!this.match(TokenType.R_PAREN)) {
                expr.args.push(this.parseExpression());
                if (this.match(TokenType.R_PAREN)) break;
                this.consume(TokenType.COMMA, 'Expected \',\'');
            }
        } else if (this.match(TokenType.L_SQUARE_BRACE)) {
            return this.member(expr);
        } else if (this.match(TokenType.DOT)) {

            let object = this.call();
            expr = {
                type: NodeTypes.DotExpression,
                object: expr,
                property: object
            }

        }

        return expr;
    }


    unary() {
        if (this.match(TokenType.BANG, TokenType.MINUS)) {
            let op = this.previous();
            let right = this.unary();
            return {
                type: NodeTypes.UnaryExpression,
                operator: op.string,
                operand: right
            }
        }
        return this.call();
    }


    multiplication() {
        let expr = this.unary();
        while (this.match(TokenType.STAR, TokenType.SLASH, TokenType.MOD)) {
            let op = this.previous();
            let right = this.multiplication();
            expr = {
                type: NodeTypes.BinaryExpression,
                left: expr,
                operator: op.string,
                right: right
            }
        }
        return expr;
    }

    addition() {
        let expr = this.multiplication();
        if (this.match(TokenType.PLUS, TokenType.MINUS)) {
            let op = this.previous();
            let right = this.addition();
            return {
                type: NodeTypes.BinaryExpression,
                left: expr,
                operator: op.string,
                right: right
            }
        }
        return expr;
    }


    comparison() {
        let expr = this.addition();
        while (this.match(TokenType.GREATER, TokenType.LESS,
                TokenType.LESS_EQUAL, TokenType.GREATER_EQUAL)) {
            let op = this.previous();
            let right = this.comparison();
            expr = {
                type: NodeTypes.BinaryExpression,
                left: expr,
                operator: op.string,
                right: right
            }
        }
        return expr;
    }

    equality() {
        let expr = this.comparison();
        while (this.match(TokenType.EQUAL_EQUAL, TokenType.BANG_EQUAL)) {
            let op = this.previous();
            let right = this.equality();
            expr = {
                type: NodeTypes.BinaryExpression,
                left: expr,
                operator: op.string,
                right: right
            }
        }
        return expr;
    }

    and() {
        let expr = this.equality();

        while (this.match(TokenType.AND)) {
            let op = this.previous();
            let right = this.equality();
            expr = {
                type: NodeTypes.LogicalExpression,
                left: expr,
                op: op,
                right: right
            }
        }

        return expr;
    }

    or() {
        let expr = this.and();

        while (this.match(TokenType.OR)) {
            let op = this.previous();
            let right = this.and();
            expr = {
                type: NodeTypes.LogicalExpression,
                left: expr,
                op: op,
                right: right
            }
        }

        return expr;
    }

    assignment() {
        let expr = this.or();

        while (this.match(TokenType.EQUAL)) {
            let value = this.or();
            if (expr.type === NodeTypes.Identifier ||
                expr.type === NodeTypes.DotExpression ||
                expr.type === NodeTypes.MemberExpression) {
                return {
                    type: NodeTypes.AssignmentExpression,
                    left: expr,
                    right: value
                }
            }
        }

        return expr;
    }

    parseExpression() {
        return this.assignment();
    }

    varDeclarator() {
        let node = {
            type: NodeTypes.VariableDeclarator
        }
        node.id = this.consume(TokenType.IDENTIFIER, 'Expected variable name.');

        node.init = null;
        if (this.match(TokenType.EQUAL))
            node.init = this.parseExpression();

        if (this.peek().type !== TokenType.COMMA)
            this.consume(TokenType.SEMICOLON, 'Expected \';\' after variable declaration.');

        return node;
    }

    printStmnt() {
        let node = {
            type: NodeTypes.PrintStatement,
            args: this.parseExpression()
        }

        this.consume(TokenType.SEMICOLON, 'Expected \';\' after print statement');
        return node;
    }

    ifStmnt() {
        let node = {
            type: NodeTypes.IfStatement,
            test: this.parseExpression(),
            consequent: null
        }

        if (this.match(TokenType.COLON)) {
            node.consequent = {
                type: NodeTypes.BlockStatement,
                prog: []
            }

            while (!(this.match(TokenType.END) || this.check(TokenType.ELSE))) {
                node.consequent.prog.push(this.declaration());
            }

        } else {
            node.consequent = this.declaration();
        }


        if (this.match(TokenType.ELSE)) {
            node.alternate = this.declaration();
        }

        return node;
    }

    blockStmnt(inloop = false, infunc = false) {
        let node = {
            type: NodeTypes.BlockStatement,
            prog: []
        }
        while (!this.match(TokenType.END)) {
            node.prog.push(this.declaration(inloop, infunc));
        }

        return node;
    }

    forStmnt() {
        let node = {
            type: NodeTypes.ForStatement,
            init: null,
            test: null,
            update: null,
        }

        this.consume(TokenType.L_PAREN, 'Expected \'(\' to initiate for loop');
        if (this.match(TokenType.DEF)) {
            node.init = {
                type: NodeTypes.VariableDeclaration,
                declarators: []
            }

            node.init.declarators.push(this.varDeclarator());
            while (this.match(TokenType.COMMA)) {
                node.init.declarators.push(this.varDeclarator());
            }
        } else
            node.init = this.parseExpression();

        node.test = this.parseExpression();
        this.consume(TokenType.SEMICOLON, 'Expected \';\'');

        node.update = this.parseExpression();
        this.consume(TokenType.R_PAREN, 'Expected \')\' to before for loop body');
        if (this.match(TokenType.COLON)) {
            node.body = {
                type: NodeTypes.BlockStatement,
                prog: []
            }

            while (!this.match(TokenType.END))
                node.body.prog.push(this.declaration(true));

        } else
            node.body = this.declaration();

        return node;
    }

    whileStmnt() {
        let node = {
            type: NodeTypes.WhileStatement,
            test: this.parseExpression()
        }

        if (this.match(TokenType.COLON)) {
            node.body = {
                type: NodeTypes.BlockStatement,
                prog: []
            }

            while (!this.match(TokenType.END))
                node.body.prog.push(this.declaration(true));

        } else
            node.body = this.declaration();

        return node;
    }

    funcDecl() {
        let node = {
            type: NodeTypes.FunctionDeclaration,
            id: this.consume(TokenType.IDENTIFIER, 'Expected Identifier as function name'),
            params: []
        }

        this.consume(TokenType.L_PAREN, 'Expected \'(\'');

        while (!this.match(TokenType.R_PAREN)) {
            this.consume(TokenType.IDENTIFIER, 'Expected Identifier as function parameter');
            node.params.push({
                type: NodeTypes.Identifier,
                name: this.previous().string
            });
            if (this.match(TokenType.R_PAREN)) break;
            this.consume(TokenType.COMMA, 'Expected \',\'.');
        }

        node.body = this.statement(false, true);
        return node;
    }

    returnStmnt() {
        if (this.match(TokenType.SEMICOLON))
            return {
                type: NodeTypes.ReturnStatement
            };

        let node = {
            type: NodeTypes.ReturnStatement,
            arg: this.parseExpression()
        };

        this.consume(TokenType.SEMICOLON, 'Expected \';\' after return statement');
        return node;
    }

    statement(inloop = false, infunc = false) {
        if (this.match(TokenType.PRINT)) {
            return this.printStmnt();
        } else if (this.match(TokenType.IF)) {
            return this.ifStmnt();
        } else if (this.match(TokenType.COLON)) {
            return this.blockStmnt(inloop, infunc);
        } else if (this.match(TokenType.FOR)) {
            return this.forStmnt();
        } else if (this.match(TokenType.BREAK, TokenType.SKIP)) {

            if (!inloop) this.error(this.previous(), this.previous().string + ' statement without an enclosing loop');
            let node = {
                type: NodeTypes.BreakStatement,
                string: this.previous().string
            }

            this.consume(TokenType.SEMICOLON, 'Expected \';\'');

            return node;
        } else if (this.match(TokenType.WHILE)) {
            return this.whileStmnt();
        } else if (this.match(TokenType.RETURN)) {
            return this.returnStmnt();
        }

        let expr = this.parseExpression();
        this.consume(TokenType.SEMICOLON, 'Expected \';\' after expression');
        return expr;
    }

    methodDecl() {
        let node = {
            type: NodeTypes.MethodDeclaration,
            static: (this.match(TokenType.STATIC)) ? true : false,
            body: [],
            params: [],
            constructor: false
        }

        this.consume(TokenType.IDENTIFIER, 'Expected identifier as method name');
        node.id = this.previous().string;
        if (node.id.string === 'init') node.constructor = true;
        this.consume(TokenType.L_PAREN, 'Expected \'(\'');
        while ((!this.match(TokenType.R_PAREN))) {
            this.consume(TokenType.IDENTIFIER, 'Expected Identifier as function parameter');
            node.params.push({
                type: NodeTypes.Identifier,
                name: this.previous().string
            });
            if (this.match(TokenType.R_PAREN)) break;
            this.consume(TokenType.COMMA, 'Expected \',\'.');
        }

        this.consume(TokenType.COLON, 'Expected \':\' before method body.');
        while (!this.check(TokenType.END) && !this.eof()) {
            node.body.push(this.declaration());
        }
        this.consume(TokenType.END, 'Expected end after class declaration.');

        return node;
    }

    classDecl() {
        let node = {
            type: NodeTypes.ClassDeclaration,
            methods: [],
            superClass: false
        }

        this.consume(TokenType.IDENTIFIER, 'Expected Identifier as class name.');

        node.id = {
            type: NodeTypes.Identifier,
            name: this.previous().string,
        }

        if (this.match(TokenType.ARROW)) {
            this.consume(TokenType.IDENTIFIER, 'Expected Identifier as class name.');
            node.superClass = {
                type: NodeTypes.Identifier,
                name: this.previous().string,
            }
        }


        this.consume(TokenType.COLON, 'Expected \':\' before class body.');
        while (!this.check(TokenType.END) && !this.eof()) {
            node.methods.push(this.methodDecl());
        }
        this.consume(TokenType.END, 'Expected end after class declaration.');
        return node;
    }

    declaration(inloop = false, infunc = false) {
        if (this.match(TokenType.DEF)) {
            let node = {
                type: NodeTypes.VariableDeclaration,
                declarators: []
            }
            node.declarators.push(this.varDeclarator());
            while (this.match(TokenType.COMMA))
                node.declarators.push(this.varDeclarator());

            return node;
        } else if (this.match(TokenType.FN)) {
            return this.funcDecl();
        } else if (this.match(TokenType.CLASS)) {
            return this.classDecl();
        }

        return this.statement(inloop, infunc);
    }

    program() {
        let node = {
            type: NodeTypes.Program
        };
        node.prog = [];
        let ctr = 0;
        while (!this.eof()) {
            node.prog.push(this.declaration());
            ctr++;
            if (ctr > 1000)
                break;
        }
        return node;
    }


    isLiteral(token) {
        return token.type === TokenType.STRING ||
            token.type === TokenType.NUMBER ||
            token.type === TokenType.FALSE ||
            token.type === TokenType.TRUE ||
            token.type === TokenType.NIL
    }
}

try {
    module.exports = Parser;
} catch (error) {

}
