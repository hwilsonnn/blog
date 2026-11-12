---
title: "URL Pattern API"
gif: "skeleton.gif"
date: "2025-10-27"
tags: ["tidbit", "javascript", "apis"]
excerpt: "Baseline URLPattern API tidbit"
---

Just want to share a new browser API that has recently become "Baseline" (available in all browsers). The URL Pattern API can be used to parse urls for parameters and other features related to the url. Previously we would need to use regex which is messy, now we can use a class to handle everything. 
 
For example, the old approach:
 
```javascript
const pathRegex = /^\/books\/([a-z]+)\/(\d+)\/?$/;
const result = pathRegex.exec("/books/classics/12345");
// `result` is an array:
// ["/books/classics/12345", "classics", "12345"]
const category = result ? result[1] : null;
const bookId = result ? result[2] : null;
```

New approach:
 
```javaScript
// Pattern to match /books/<category>/<id>
const pattern = new URLPattern({ pathname: "/books/:category/:id" });
const result = pattern.exec("/books/classics/12345");
// `result.pathname.groups` will return:
// { category: "classics", id: "12345" }
const { category, id: bookId } = result.pathname.groups;
```

Relevant article: https://web.dev/blog/baseline-urlpattern
