
try {
    module.exports = transpileToJS;
} catch (error) {

}

function transpileToJS(exp) {
    return js(exp);

    function js(exp) {

        switch (exp.type) {
            case 'BlockStatement':
                return blockStmnt(exp);
            case 'Program':
                return prog(exp);
            case 'VariableDeclaration':
                return varDecl(exp);
            case 'PrintStatement':
                return printStmt(exp);
            case 'BinaryExpression':
                return binary(exp);
            case 'UnaryExpression':
                return unary(exp);
            case 'AssignmentExpression':
                return assgn(exp);
            case 'GroupingExpression':
                return group(exp);
            case 'Literal':
                return literal(exp);
            case 'Identifier':
                return exp.name;
            case 'IfStatement':
                return ifStmnt(exp);
            case 'ForStatement':
                return forStmnt(exp);
            case 'BreakStatement':
                return 'break;'
            case 'SkipStatement':
                return 'continue;'
            case 'WhileStatement':
                return whileStmnt(exp);
            case 'LogicalExpression':
                return logicExp(exp);
            case 'FunctionDeclaration':
                return funcDecl(exp);
            case 'CallExpression':
                return call(exp);
            case 'ReturnStatement':
                return returnStmnt(exp);
            case 'ArrayExpression':
                return array(exp);
            case 'MemberExpression':
                return member(exp);
            case 'DotExpression':
                return dotexp(exp)
            case 'ThisExpression':
                return 'this';
            case 'ClassDeclaration':
                return classDecl(exp);
            case 'MethodDeclaration':
                return methodDecl(exp);
            case 'NewExpression':
                return newExpr(exp);
            default:
                throw new Error('Error while transpiling to JS')
        }
    }

    function newExpr(exp) {
        let ret = 'new ' + exp.callee.name + '(';
        ret += exp.args.map(js).join(', ') + ')';
        return ret;
    }

    function classDecl(exp) {
        let ret = 'class ' + js(exp.id) + ((exp.superClass) ? (' extends ' + exp.superClass.name) : '') + '{\n';
        ret += exp.methods.map(js).join('\n');
        return ret + '\n}';
    }

    function methodDecl(exp) {
        let ret = ((exp.static) ? 'static ' : '') + ((exp.id === 'init') ? 'constructor' : exp.id) + '(';
        let params = exp.params.map(js).join(', ');
        ret += params + ') {\n' + exp.body.map(js).join(' ;\n') + '\n}';
        return ret;
    }

    function dotexp(exp) {
        return js(exp.object) + '.' + js(exp.property);
    }

    function member(exp) {
        return js(exp.object) + '[' + js(exp.property) + ']';
    }

    function array(exp) {
        return '[' + exp.elements.map(js).join(', ') + ']';
    }

    function returnStmnt(exp) {
        let ret = 'return ';
        if (exp.arg) ret += js(exp.arg);
        return ret + ';';
    }

    function call(exp) {
        return js(exp.callee) + '(' + exp.args.map(js).join(', ') + ')';
    }

    function funcDecl(exp) {
        let ret = 'function ' + exp.id.string + '(';
        ret += exp.params.map(js).join(', ');
        ret += ') ';

        return ret + js(exp.body);
    }

    function prog(exp) {
        return exp.prog.map(js).join(' ;\n');
    }

    function group(exp) {
        return '(' + js(exp.Expression) + ')';
    }

    function varDecl(exp) {
        let decls = []
        for (let decl of exp.declarators) {
            decls.push(varDeclarator(decl));
        }

        return 'let ' + decls.join(',');
    }

    function varDeclarator(exp) {
        return exp.id.string + ' = ' + js(exp.init);
    }

    function binary(exp) {
        return js(exp.left) + ' ' + exp.operator + ' ' + js(exp.right);
    }

    function logicExp(exp) {
        let op = (exp.op.string == "or") ? ' || ' : ' && ';
        return js(exp.left) + op + js(exp.right);
    }

    function unary(exp) {
        return exp.operator + js(exp.operand);
    }

    function literal(exp) {
        return exp.string;
    }

    function printStmt(exp) {
        return 'console.log(' + js(exp.args) + ');';
    }

    function ifStmnt(exp) {
        let ret = ' if (' + js(exp.test) + ') ' + js(exp.consequent);
        if (exp.alternate) {
            ret += ' else ' + js(exp.alternate);
        }
        return ret;
    }

    function blockStmnt(exp) {
        return '{\n' + prog(exp) + '\n}';
    }

    function forStmnt(exp) {
        return `for(${js(exp.init)}; ${js(exp.test)}; ${js(exp.update)}) ${js(exp.body)}`;
    }

    function whileStmnt(exp) {
        return `while (${js(exp.test)}) ${js(exp.body)}`;
    }

    function assgn(exp) {
        return js(exp.left) + ' = ' + js(exp.right);
    }

}