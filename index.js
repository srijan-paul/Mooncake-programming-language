// testing the language

let code1 = `def a = 4, b = 3;
print 1 + 2 - (1 - 1 + 2);
if a == 1 print "a is 1";
else if a == 2 print "a is 2";
else print "a is something other than 1 and 2";
`;

let code2 =
    `def n = 10, output = "";
for(def i = 1; i <= n; i = i + 1):
    if (i % 3 == 0) output = output + "Fizz";
    if (i % 5 == 0) output = output + "Buzz";
    if (output != "") print output;
    else print i;
    output = "";
end`;


let code3 =
    `def a = 2 or (3 and 4);
print a;`;

let code4 =
    `fn fib(n):
        if(n <= 1) return 1; 
        else return fib(n - 1) + fib(n - 2);
    end
    print fib(8); # outputs 34`;

let code5 =
    `def a = [1, 2 ,3];
    for(def i = 0; i < 3; i = i + 1):
        print a[i];
    end
`;

let code6 =
    `class Animal:
       
        init(sound):
            this.sound = sound;
        end

        eat():
            print "nom nom";
            print this.sound;
        end
    end

    class Dog <- Animal:

        init(name, sound):
            super(sound);
            this.name = name;
        end

        bark():
            print this.name + " says " + this.sound;
        end
    end
    
    def animal = new Animal("Woof"), spike = new Dog("Spike", "Bow Bow !!");
    animal.eat();
    spike.bark();
    `;

let tokens = lex(code5);
let parser = new Parser(tokens);
let ast = parser.program();
let jscode = transpileToJS(ast);

eval(jscode)