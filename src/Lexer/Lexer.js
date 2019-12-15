try {
    module.exports = lex
} catch (e) {

}

if (typeof module == "object") {
    TokenType = require('../Lexer/TokenType.js');
    keywords = require('../Lexer/Keywords.js');
}

function lex(text) {
    let start = 0,
        current = 0,
        line = 1,
        tokens = [];

    function eof() {
        return current > text.length;
    }

    function next() {
        return text.charAt(current++);
    }

    function peek() {
        return text.charAt(current);
    }

    function peekNext() {
        if (current + 1 > text.length) return null;
        return text.charAt(current + 1);
    }

    function isDigit(c) {
        return c >= '0' && c <= '9';
    }

    function isAlpha(c) {
        return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c === '_';
    }

    function isAlphaNumeric(c) {
        return isDigit(c) || isAlpha(c);
    }

    function addToken(type, literal) {
        let string = text.substring(start, current);
        let tk = {
            type: type,
            string: string,
            value: (literal == undefined) ? "" : literal,
            line: line,
            start: start,
            end: current
        }
        tokens.push(tk);
    }

    function getNum() {
        while (isDigit(peek())) next();

        if (peek() === '.' && isDigit(peekNext())) {
            next();
            while (isDigit(peek())) {
                next();
            }
        }
        let txt = text.substring(start, current);
        addToken(TokenType.NUMBER, parseFloat(txt))
    }

    function getIdentifier() {
        while (isAlphaNumeric(peek())) next();
        let txt = text.substring(start, current);
        let type = TokenType.IDENTIFIER;
        if (keywords[txt]) {
            type = keywords[txt];
            addToken(type);
        } else {
            addToken(type, txt);
        }
    }

    function getString() {
        while (peek() !== '"' && !eof()) {
            if (peek() === '\n') line++;
            next();
        }
        if (eof()) throw new Error(`Unterminated String literal at line ${line}`);
        next(); //consume the ending "
        addToken(TokenType.STRING, text.substring(start + 1, current - 1));
    }

    function match(expected) {
        if (eof()) return false
        if (text.charAt(current) !== expected) return false;

        current++;
        return true;
    }

    function scanToken(c) {
        switch (c) {
            case '(':
                addToken(TokenType.L_PAREN);
                break;
            case ')':
                addToken(TokenType.R_PAREN);
                break;
            case '[':
                addToken(TokenType.L_SQUARE_BRACE);
                break;
            case ']':
                addToken(TokenType.R_SQUARE_BRACE);
                break;
            case '{':
                addToken(TokenType.L_BRACE);
                break;
            case '}':
                addToken(TokenType.R_BRACE);
                break;
            case ',':
                addToken(TokenType.COMMA);
                break;
            case '.':
                addToken(TokenType.DOT);
                break;
            case '%':
                addToken(TokenType.MOD);
                break;
            case ':':
                addToken(TokenType.COLON);
                break;
            case '-':
                addToken(match('=') ? TokenType.PLUS_EQUAL : TokenType.MINUS);
                break;
            case '+':
                addToken(match('=') ? TokenType.PLUS_EQUAL : TokenType.PLUS);
                break;
            case ';':
                addToken(TokenType.SEMICOLON);
                break;
            case '*':
                if (match('=')) {
                    addToken(TokenType.STAR_EQUAL);
                } else if (match('**')) {
                    addToken(TokenType.STAR_STAR);
                } else {
                    addToken(TokenType.STAR);
                }
                break;
            case '/':
                addToken(match('=') ? TokenType.SLASH_EQUAL : TokenType.SLASH);
                break;
            case '=':
                addToken(match('=') ? TokenType.EQUAL_EQUAL : TokenType.EQUAL);
                break;
            case '!':
                addToken(match('=') ? TokenType.BANG_EQUAL : TokenType.BANG);
                break;
            case '<':
                if (match('='))
                    addToken(TokenType.LESS_EQUAL);
                else if (match('-'))
                    addToken(TokenType.ARROW);
                else
                    addToken(TokenType.LESS);
                break;
            case '>':
                addToken(match('=') ? TokenType.GREATER_EQUAL : TokenType.GREATER);
                break;
            case '#':
                while (!eof() && peek() !== '\n') next();
                break;
            case ' ':
            case '':
            case '\r':
            case '\t':
                // Ignore whitespace.                      
                break;
            case '\n':
                line++;
                break;
            case '"':
                getString();
                break;
            default:
                if (isDigit(c)) {
                    getNum();
                } else if (isAlpha(c)) {
                    getIdentifier();
                } else {
                    throw new Error('Unexpected character ' + c + ' at line ' + line);
                }
                break;
        }

    }

    while (!eof()) {
        start = current;
        let c = next();
        scanToken(c);
    }

    tokens.push({
        type: TokenType.EOF,
        string: ""
    });

    return tokens;
}