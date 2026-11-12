---
title: "Automatic Semicolon Insertion"
gif: "magnifyingGlass.gif"
date: "2024-09-09"
tags: ["tidbit", "javscript"]
excerpt: "ASI and why Javascript doesn't (necessarily) need semicolons"
---

TIL about Automatic Semicolon Insertion (ASI) in javascript. Like a lot of programming languages sections of code are broken up by semicolons, javascript is no different. Although javascript lets us write code without semicolons there are some statements which require semicolons in order for our code to make syntactical sense, at this point semicolons will be added (assuming there is also a line break). JS is pretty good at adding semicolons, however this requires us to have some idea about where semicolons may be added in our code. Code formatters like [prettier](https://prettier.io/docs/en/rationale.html#semicolons) will attempt to add semicolons to our code when it believes a semicolon is required for the syntax to make sense, I recommend using this to support with FE development as it helps keep ASI more predictable. Without ASI, seemingly valid code may have some unpredictable behaviour: 

```javaScript
const b = 1
[1, 2, 3].forEach(console.log)
```

Resolving to 

```javaScript
const b = 1[1, 2, 3].forEach(console.log)
```

In cases like this, it is recommended to add a semicolon before the troublesome lines, like:

```javaScript
const b = 1
;[1, 2, 3].forEach(console.log)
```

This syntax might look a little weird, but from my research this seems to be the widely recommended approach.
 
For a bit of further reading on this I would recommend checking out:
* https://blog.izs.me/2010/12/an-open-letter-to-javascript-leaders-regarding/ < high level run through of why we need ASI, with the good, bad, and workarounds
* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar#automatic_semicolon_insertion < more accurate detailing of how and why this exists and some dos and don'ts (this is also heavily founded on the javscript language specifications: https://tc39.es/ecma262/multipage/ecmascript-language-lexical-grammar.html#sec-automatic-semicolon-insertion)
