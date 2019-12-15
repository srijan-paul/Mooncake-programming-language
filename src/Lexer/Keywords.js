if (typeof module == "object") {
    TokenType = require('./TokenType.js');
}

const keywords = {
    "and": TokenType.AND,
    "else": TokenType.ELSE,
    "false": TokenType.FALSE,
    "for": TokenType.FOR,
    "then": TokenType.THEN,
    "fn": TokenType.FN,
    "if": TokenType.IF,
    "nil": TokenType.NIL,
    "or": TokenType.OR,
    "print": TokenType.PRINT,
    "def": TokenType.DEF,
    "return": TokenType.RETURN,
    "this": TokenType.THIS,
    "true": TokenType.TRUE,
    "while": TokenType.WHILE,
    "end": TokenType.END,
    "break": TokenType.BREAK,
    "skip": TokenType.SKIP,
    "static": TokenType.STATIC,
    "class": TokenType.CLASS,
    "new": TokenType.NEW
}

try {
    module.exports = keywords;
} catch (e) {

}