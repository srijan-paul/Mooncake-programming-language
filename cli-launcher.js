const fs = require('fs');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

const Parser = require('./src/Parser/MoonCake.js');
const lex = require('./src/Lexer/Lexer.js');
const compiletoJS = require('./src/JS Transpiler/JSCompiler.js')

readline.question("\033[95mMooncake\033[0m programming language version 1.0.0 \n", (input) => {
    let args = input.split(' ');
    if (args.length !== 2 || args[0].toUpperCase() != 'moonc'.toUpperCase()) {
        console.log('Usage : moonc <filename>');
    } else {
        let path = args[1];
        fs.readFile(path, 'utf8', (err, code) => {
            if(!code) {
                console.log('The file was not found.');
                return;
            }
            let parser = new Parser(lex(code));
            let ast = parser.program();
            let jscode = compiletoJS(ast);
  
            eval(jscode);
        });
    }
    readline.close();
});
