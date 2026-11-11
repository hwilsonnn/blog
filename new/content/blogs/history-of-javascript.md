---
title: "History of Javascript"
gif: "dunking.gif"
date: "2024-11-24"
tags: ["knowledge share", "javascript"]
excerpt: "Why talk about history?"
---

## Why talk about history?

- I will probably want to so some FE related sessions in the future

- Knowing why something is the way it is due to its history can help you understand why things are the way they are.

- First session, what's more introductory than a history lesson...

## Where it all began

- Netscape Navigator was the first mainstream browser due to its low barrier of entry and user accessibility

- Early internet was static which limited development and what could be displayed, due to the size of Netscape they wanted to change that

- Netscape wanted to change that by adding a programming language to its browser

- Netscape hired Brendan Eich to implement the programming language 'Scheme' in the browser, whilst Netscape would collaborate with Sun Microsystems (creators of Java) would focus on adding Java in the browser
  - Java was to be used to create the sites and various apps, but Scheme would be used to glue everything together

## Java in the browser?

- Netscape eventually decided that Scheme was too different to Java, they wanted something that 'looked like' Java

- Brendan then was tasked to create a prototype 'Java scripting' language
  - It is well enough known that this prototype was completed in 10 days
    - This prototype was called 'Mocha'

## Marketing and Release

- In the beta releases of Netscape Navigator, Mocha (Javascript) was first publicly called 'LiveScript'
  - 'Live' because that was a common part of Netscape's product lineup, 'script' because it was the web's scripting language

  - The beta shipped with pretty much the prototype of Javascript, no major changes were made

- Once in production though, the name was changes again into JavaScript
  - This was due to the popularity of Java at the time
    - Just building off the hype of Java

## Knock, Knock. It's Microsoft

- Microsoft introduced Internet Explorer, and with it a new scripting language called JScript

- JScript worked and was implemented a little different to JavaScript, causing websites to look and function differently in both browsers.

## Fighting Microsoft

- In order to legitimize JavaScript, Netscape went to ECMA to try and make JavaScript into a standard
  - ECMA (European Computer Manufacturers Association), non-profit standards organization, they standardize stuff like
    - File formatting systems

    - CD-ROMs

    - C#

    - C++

    - JSON

  - However, as Sun Microsystems worked with Netscape they got the trademark of 'JavaScript', so Netscape couldn't submit that as the standardized language, so the language specification became 'ECMAScript'

## So, what is JavaScript?

- It's still a scripting language, but there is no 'code' for how the language is implemented, there are only specifications.

- ECMA defines the **standards** with input from the community, but is driven by a panel of companies and experts

- JavaScript as a language needs to be interpreted
  - The most common JS engine you will hear is V8, which is used by Node.js and all chromium browsers

## ECMAscript + other ecmascript languages

- Other implementations of the ECMAScript standards
  - ActionScript
    - Was originally created to support with Adobe Flash animations

  - JScript
    - Microsoft's original competitor to JavaScript, and later adapted to the standards

  - QtScript

  - InScript

  - Google Apps Script

## Where are they now

- Brendan Eich
  - Co-founded the Mozilla organization

  - Eventually became CEO but left after his political donations came to light

  - Co-Founded Brave, the browser company

- Netscape
  - Bought by AOL and then shut down

- JavaScript
  - After being the most popular language as ranked by github contributions for over a decade, Javascript recently became the second most popular language, second to Python. Though Typescript is the third most popular language, so do what you will with that information.

  - As for the name
    - Sun Microsystems (the company that worked with Netscape and owned the JavaScript trademark) was eventually bought by Oracle.

    - Oracle still owns the name for Javascript, despite having nothing to do with Javascript

    - A recent open letter was created by some heavy hitters in the JS space attempting to create a Petition for Trademark Cancellation, over 14 thousand people have signed including
      - Creator of Node, Brendan Eich, EcmaScript editors, creator of npm

## Conclusion

- The future for JS looks strong with the FE space constantly changing and browsers becoming more and more powerful

- If you do want to take a look at what the future of JavaScript/EcmaScript is, then you can take a look at all of the public content for the EcmaScript technical committee, including
  - The specifications

  - The proposals
    - The proposal I most look forward to is the Temporal Api, which greatly improves date handling

  - Past and future meeting agendas + notes

  - Test suite, etc

- JavaScript is also no longer a client-side thing, with javascript servers and server-side rendering becoming more and more popular.

## Bibliography

- <https://brendaneich.com/2008/04/popularity/>

- <https://exploringjs.com/es5/ch04.html>

- <https://en.wikipedia.org/wiki/JavaScript>

- <https://javascript.tm/>

- <https://github.blog/news-insights/octoverse/octoverse-2024/>

- <https://en.wikipedia.org/wiki/Brendan_Eich>
