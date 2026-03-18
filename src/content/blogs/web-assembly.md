---
title: "WebAssembly"
date: "2025-02-18"
tags: ["knowledge share", "javascript", "wasm"]
excerpt: "Why use Web Assembly"
---

## Intro

- JavaScript, HTML, CSS. The three languages of the web. That was until 2019, when WebAssembly became the fourth official language of the Web.

- WebAssembly (or Wasm) is an assembly-like language that runs with near native performance in the browser.

- It opens the door to other languages (C, C++, C#, Rust, Python, Go, etc) to compile and run on the web.

- The intention isn't to replace JS, as we learnt in the History of JS presentation, JS is a scripting language to support with improving user experiences. Wasm is all about performance and complimenting Javascript.

## Why use Web assembly?

- Portability
  - Instead of building, compiling, and deploying for multiple end environments, you can just compile to wasm and make your project available to everyone through the web.

- Security
  - WebAssembly is run in the browser's sandboxed environment, which limits the APIs or instructions that the code can execute, doesn't require OS level access

  - Still adheres to single origin policies, and can't access data outside of the environment

- Accessibility
  - Bring native applications to the web, no additional installs required outside of the browser

- Performance!
  - JS is a JIT compilation, whereas Wasm is Ahead-Of-Time (AOT), no need for interpreter

  - Image processing ~3x faster than JS

  - AI/ML ~2x faster than JS

  - Audio processing ~2x faster than JS

## Some examples of sites using Wasm

- To frame use cases of Wasm into a bit more context, the following are examples of sites which use Wasm
  - Google Earth
    - Which ports pieces of the old native Google Earth program to the web

  - Figma
    - Originally written in C++ and transpiled to asm.js (subset of js focused for performance), when migrating to Wasm they saw a >3x performance boost in load times

    - Figma also uses React for certain UI elements, good example of combination between Wasm and JS

  - CapCut

  - 1Password

  - AutoCAD

  - TensorFlow

  - Adobe applications
    - Photoshop, Acrobat, Lightroom, Express

- Others
  - There is a `wasm` filter in your browser network tab, so you can keep an eye out to see if there are wasm files loaded into a site.

## Working with Wasm

- You'll see two types of files when working with WebAssembly
  - `.wat` - web assembly text (Low level language similar to assembly)

  - `.wasm` - binary format of the assembly text
    - Higher level languages will be compiled into this format

    - This isn't quite machine code, that still needs to be done by the browser

- To use the `.wasm` file
  - Pull it into the browser (`fetch('myWasmFile.wasm')`)

  - Use the `WebAssembly` browser API to load in the file through `WebAssembly.instantiate()` or `WebAssembly.instantiateStreaming()`
    - The browser will compile the `.wasm` code to machine code in the WebAssembly Runtime

    - The Wasm Runtime is part of the JS engine

  - Use the exported Wasm functions

- Common libraries
  - [Emscripten](https://emscripten.org/) - Used to compile C/C++ projects to Wasm formats

  - There is almost a library for every language, but only C, C++, Rust, and Go are the best supported wasm languages

## Example of loading in wasm code

```javscript
fetch('module.wasm')
  .then(response => response.arrayBuffer())
  .then(bytes => WebAssembly.instantiate(bytes))
  .then(module => {
    const add = module.instance.exports.add;

    const result = add(1, 2);
    console.log(result);
  });
```

Taken from [Demystifying WebAssembly: What Beginners Need to Know](https://thenewstack.io/webassembly/webassembly-what-beginners-need-to-know/).

## Future of Wasm

- Though the intentions of Wasm is for it to be run on the web, there is nothing stopping it from being run elsewhere
  - You can already run it separately to the browser via runtimes like node.js

  - Maybe run in a place where there isn't even a JS engine

  - These additional use cases are considered by the WebAssembly System Interface body, a subgroup of the World Wide Web Consortium

- Fundamentally WebAssembly is a compilation target and requires as single runtime environment
  - This means you could have a team or a company that writes code in multiple different languages, but they can all be transpiled to Wasm and all run in the same environment

  - It is a game changer in that sense, you no longer need language specific runtime environments (virtual machines), you just use a single Wasm runtime for all your projects!

- It is however only a little over 5 years old, so the support and direction is still being worked out
  - I.e.,
    - How to modularise Wasm components

    - WASM is manual data management out of the box, so dynamic garbage collection aren't natively supported

## Bibliography

- [WebAssembly.org](https://webassembly.org/)

- [Web Assembly (WASM) in 100 Seconds](https://www.youtube.com/watch?v=cbB3QEwWMlA)

- [Made with WebAssembly](https://madewithwebassembly.com/)

- [asm.js](https://en.wikipedia.org/wiki/Asm.js)

- [WebAssembly cut Figma's load time by 3x](https://www.figma.com/blog/webassembly-cut-figmas-load-time-by-3x/)

- [WebAssembly (mdn)](https://developer.mozilla.org/en-US/docs/WebAssembly)

- [Demystifying WebAssembly: What Beginners Need to Know](https://thenewstack.io/webassembly/webassembly-what-beginners-need-to-know/)

- [Non-Web Embeddings](https://webassembly.org/docs/non-web/)

- [WebAssembly is still waiting for its moment](https://leaddev.com/technical-direction/webassembly-still-waiting-its-moment)

- [WebAssembly | A Beginner's Guide](https://www.xenonstack.com/insights/a-beginners-guide-to-webassembly)
