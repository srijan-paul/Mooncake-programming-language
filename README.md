<!--
*** Thanks for checking out this README Template. If you have a suggestion that would
*** make this better, please fork the repo and create a pull request or simply open
*** an issue with the tag "enhancement".
*** Thanks again! Now go create something AMAZING! :D
-->





<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]


<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="#">
    <img src="./assets/imgs/logo-final.png" alt="Logo" width="200" height="200">
  </a>

  <h3 align="center">Mooncake programming language</h3>

  <p align="center">
   A compile-to-JS programming language written in Javascript.
    <br />
    <a href="#"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/tiltproofRain/Mooncake-programming-language/issues">Report Bug</a>
    ·
    <a href="https://github.com/tiltproofRain/Mooncake-programming-language/issues">Request Feature</a>
  </p>
</p>



<!-- TABLE OF CONTENTS -->
## Table of Contents

* [About the Project](#about-the-project)
  * [Built With](#built-with)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
* [Usage](#usage)
* [Contributing](#contributing)
* [License](#license)
* [Contact](#contact)
* [Acknowledgements](#acknowledgements)


<!-- ABOUT THE PROJECT -->
## About The Project

[![Product Name Screen Shot][product-screenshot]]

Mooncake :cake: is a compact, dynamically typed compile-to-JS programming language written in javascript.
It has a hand written [Lexer][lexer-url] and [Parser][parser-url]. And it compiles to javascript with the help of hand written transpiler.
The goal was to learn the craft of generating ASTs from lexemes all the while creating a programming language with all the features one would expect in place. I hope to implement a (slower) tree walk Interpreter soon enough.

### Built With
Mooncake is writte in javascript (ES6).  you will need NodeJS to run and execute it in the terminal.
A browser version will be added soon.

<!-- GETTING STARTED -->
## Getting Started
Simply download or fork the repo, navigate to the root directory and launch the repl.

```sh
node cli-launcher.js
```
### Prerequisites
All you need is node.js to run the cli-launcher in your terminal.

* node-js


## Syntax
Mooncake has a clean syntax which borrows a little bit from both Javascript and python.

### Hello World.
You can use the print statement to print something onto the console / terminal. 
The syntax is similar to that of Python 2's print. 

```
print "Hello, World!";
```

### Variable Declaration.
Variables are declared using the 'def' keyword.

```
def name = "Humpty Dumpty";
print name;
```

### Looping

As of version 1.0.0 , Mooncake has two classic loops, `for` and `while`.

```
def a = [1, 2 ,3];
for(def i = 0; i < 3; i = i + 1):
    print a[i];
end
```

```
def a = [1, 2, 3];
def index = 0;
while (index < a.length) : 
  #code
end
```

### If-else statements

Note that for chained if else statements, we put all the `end` keywords at the end instead of having one at the end of every branch because that looks cleaner.
```
if condition:
  #code
else if condition:
  #code
else:
  #code
end end end
```

### Function Declaration and calling.
Functions are declared using the `fn` keyword. Here is an example of a recursive function to print the nth Fibonacci number.

```
fn fib(n):
        if(n <= 1) return 1; 
        else return fib(n - 1) + fib(n - 2);
end
print fib(8); # outputs 34
```

### Classes and Inheritance.
Classes are declared using the `class` keyword followed by the class name. 
You can add an `init` function as a constructor.

Classes can be extended using the `<-` keyword.

```
subclass <- superclass:
    #class-body
end
```

```
class Animal:
       
        init(sound):
            this.sound = sound;
        end

        eat():
            print "nom nom";
            print this.sound;
        end
    end

   # the '<-' token is like the 'extend' keyword
   # in other languages
   class Dog <- Animal:

        init(name, sound):
            super(sound);
            this.name = name;
        end

        bark():
            print this.name + " says " + this.sound;
        end
    end
    
def animal = new Animal("Woof"), spike = new Dog("Spike", "Bark Bark !!");
animal.eat(); #nom nom Woof
spike.bark(); #Bark Bark
```



<!-- USAGE EXAMPLES -->
## Usage

Using Mooncake is very simple.
Compile and run using `moonc`

```sh
node cli-launcher.js
moonc filename.mn
```

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.

<!-- CONTACT -->
## Contact

Email: srijannr1@gmail.com

Project Link: [https://github.com/tiltproofRain/Mooncake-programming-language](https://github.com/tiltproofRain/Mooncake-programming-language)



<!-- ACKNOWLEDGEMENTS -->
## Acknowledgements

* [Crafting Interpreters](http://www.craftinginterpreters.com/)
* [GitHub Emoji Cheat Sheet](https://www.webpagefx.com/tools/emoji-cheat-sheet)
* [Choose an Open Source License](https://choosealicense.com)
* [GitHub Pages](https://pages.github.com)




<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/tiltproofRain/Mooncake-programming-language.svg?style=flat-square
[contributors-url]: https://github.com/tiltproofRain/Mooncake-programming-language/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/tiltproofRain/Mooncake-programming-language.svg?style=flat-square
[forks-url]: https://github.com/tiltproofRain/Mooncake-programming-language/network/members
[stars-shield]: https://img.shields.io/github/stars/othneildrew/Best-README-Template.svg?style=flat-square
[stars-url]: https://github.com/othneildrew/Best-README-Template/stargazers
[issues-shield]: https://img.shields.io/github/issues/othneildrew/Best-README-Template.svg?style=flat-square
[issues-url]: https://github.com/tiltproofRain/Mooncake-programming-language/issues
[license-shield]: https://img.shields.io/github/license/othneildrew/Best-README-Template.svg?style=flat-square
[license-url]: https://github.com/tiltproofRain/Mooncake-programming-language/blob/master/LICENCE.txt
[product-screenshot]: images/screenshot.png
[lexer-url]: https://github.com/tiltproofRain/Mooncake-programming-language/tree/master/src/Lexer
[parser-url]: https://github.com/tiltproofRain/Mooncake-programming-language/blob/master/src/Parser/MoonCake.js
