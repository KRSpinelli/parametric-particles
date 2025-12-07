function tokenize(input) {
    const tokens = [];
    let i = 0;

    while (i < input.length) {
        const ch = input[i];

        // Skip whitespace
        if (/\s/.test(ch)) {
            i++;
            continue;
        }

        // Numbers (very simple, supports 12, 3.14, .5, 5.)
        if (/[0-9.]/.test(ch)) {
            const start = i;
            let dotCount = 0;
            while (i < input.length && /[0-9.]/.test(input[i])) {
                if (input[i] === '.') dotCount++;
                if (dotCount > 1) {
                    throw new Error(`Invalid number literal with multiple dots at position ${i}`);
                }
                i++;
            }
            const raw = input.slice(start, i);
            const value = parseFloat(raw);
            if (Number.isNaN(value)) {
                throw new Error(`Invalid number literal "${raw}" at position ${start}`);
            }
            tokens.push({ type: 'number', value, pos: start });
            continue;
        }

        // Identifiers: theta, sin, cos, etc.
        if (/[a-zA-Z_]/.test(ch)) {
            const start = i;
            while (i < input.length && /[a-zA-Z0-9_]/.test(input[i])) {
                i++;
            }
            const ident = input.slice(start, i);
            tokens.push({ type: 'identifier', value: ident, pos: start });
            continue;
        }

        // Single-character tokens
        if ('+-*/^(),'.includes(ch)) {
            tokens.push({ type: ch, pos: i });
            i++;
            continue;
        }

        throw new Error(`Unexpected character "${ch}" at position ${i}`);
    }

    tokens.push({ type: 'EOF', pos: input.length });
    return tokens;
}

function createParser(tokens) {
    let pos = 0;

    function peek() {
        return tokens[pos];
    }

    function consume(expectedType) {
        const token = peek();
        if (token.type === expectedType) {
            pos++;
            return token;
        }
        throw parseError(`Expected "${expectedType}" but found "${token.type}"`);
    }

    function parseError(message) {
        const token = peek();
        return new Error(`${message} at position ${token.pos}`);
    }

    function parseExpression() {
        let node = parseTerm();
        while (peek().type === '+' || peek().type === '-') {
            const op = peek().type;
            consume(op);
            const right = parseTerm();
            node = {
                type: 'BinaryExpression',
                operator: op,
                left: node,
                right
            };
        }
        return node;
    }

    function parseTerm() {
        let node = parsePower();
        while (peek().type === '*' || peek().type === '/') {
            const op = peek().type;
            consume(op);
            const right = parsePower();
            node = {
                type: 'BinaryExpression',
                operator: op,
                left: node,
                right
            };
        }
        return node;
    }

    // Power: right-associative exponentiation (a ^ b ^ c = a ^ (b ^ c))
    function parsePower() {
        let node = parseUnary();
        while (peek().type === '^') {
            consume('^');
            const right = parseUnary();
            node = {
                type: 'BinaryExpression',
                operator: '^',
                left: node,
                right
            };
        }
        return node;
    }

    function parseUnary() {
        const token = peek();
        if (token.type === '+' || token.type === '-') {
            consume(token.type);
            const argument = parseUnary();
            return {
                type: 'UnaryExpression',
                operator: token.type,
                argument
            };
        }
        return parsePrimary();
    }

    function parsePrimary() {
        const token = peek();

        // Number literal
        if (token.type === 'number') {
            consume('number');
            return { type: 'NumberLiteral', value: token.value };
        }

        // Identifier: either function call or variable "theta"
        if (token.type === 'identifier') {
            consume('identifier');
            const name = token.value;

            // Function call: name(...)
            if (peek().type === '(') {
                consume('(');
                const args = [];
                if (peek().type !== ')') {
                    args.push(parseExpression());
                    while (peek().type === ',') {
                        consume(',');
                        args.push(parseExpression());
                    }
                }
                consume(')');
                return {
                    type: 'CallExpression',
                    callee: name,
                    arguments: args
                };
            }

            // Variable
            if (name === 'theta') {
                return { type: 'Variable' };
            }

            if (name === 'pi') {
                return { type: 'NumberLiteral', value: Math.PI };
            }

            throw parseError(`Unknown identifier "${name}"`);
        }

        // Parenthesized expression
        if (token.type === '(') {
            consume('(');
            const expr = parseExpression();
            if (peek().type !== ')') {
                throw parseError('Missing closing parenthesis ")"');
            }
            consume(')');
            return expr;
        }

        throw parseError(`Unexpected token "${token.type}"`);
    }

    function parse() {
        const ast = parseExpression();
        if (peek().type !== 'EOF') {
            throw parseError('Unexpected extra input after valid expression');
        }
        return ast;
    }

    return { parse };
}

const FUNCTIONS = {
    sin: Math.sin,
    cos: Math.cos,
    tan: Math.tan,
    asin: Math.asin,
    acos: Math.acos,
    atan: Math.atan,
    log: Math.log,   // natural log
    exp: Math.exp,
    sqrt: Math.sqrt,
    abs: Math.abs
};

function evaluateAst(node, context) {
    switch (node.type) {
        case 'NumberLiteral':
            return node.value;

        case 'Variable':
            if (typeof context.theta !== 'number') {
                throw new Error('theta must be a number');
            }
            return context.theta;

        case 'UnaryExpression': {
            const v = evaluateAst(node.argument, context);
            if (node.operator === '+') return +v;
            if (node.operator === '-') return -v;
            throw new Error(`Unknown unary operator "${node.operator}"`);
        }

        case 'BinaryExpression': {
            const left = evaluateAst(node.left, context);
            const right = evaluateAst(node.right, context);
            switch (node.operator) {
                case '+': return left + right;
                case '-': return left - right;
                case '*': return left * right;
                case '/': return left / right;
                case '^': return Math.pow(left, right);
                default:
                    throw new Error(`Unknown binary operator "${node.operator}"`);
            }
        }

        case 'CallExpression': {
            const fn = FUNCTIONS[node.callee];
            if (!fn) {
                throw new Error(`Unknown function "${node.callee}"`);
            }
            const args = node.arguments.map(arg => evaluateAst(arg, context));
            return fn(...args);
        }

        default:
            throw new Error(`Unknown AST node type "${node.type}"`);
    }
}


function compilePolarExpression(source) {
    try {
        // Optional preprocessing: allow "r = ..." and strip the left side.
        const trimmed = source.trim();
        const expr = trimmed.startsWith('r =') || trimmed.startsWith('r=')
            ? trimmed.replace(/^r\s*=\s*/, '')
            : trimmed;

        const tokens = tokenize(expr);
        const parser = createParser(tokens);
        const ast = parser.parse();

        // Return a function of theta
        const fn = (theta) => {
            return evaluateAst(ast, { theta });
        };

        return { ok: true, ast, fn };
    } catch (err) {
        return {
            ok: false,
            error: err.message || String(err)
        };
    }
}

export default compilePolarExpression;