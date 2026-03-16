---
title: "Scroll Animations"
date: "2025-09-29"
tags: ["tidbit", "css"]
excerpt: "Sharing the differences between 'scroll state' and 'scroll driven' animations"
---

Just wanted to share some interesting css that was used with the CargoWise nav redesign work. We wanted to change the height of the nav on scroll. Traditionally what people would do is jump straight to javascript to make this happen, but there are actually two main css-only approaches:
Scroll state - used to trigger specific style changes on scroll at specific trigger points
Scroll driven - used to trigger much broader animations
These things sound very similar (and they are), but the main difference is what gets triggered. Scroll state triggers style changes, whereas scroll driven triggers an animation. 
 
I recommend taking a look at the following demo for a simple implementation and comparison of both approaches: https://codepen.io/web-dot-dev/pen/emOrBaV

We chose to go for the Scroll driven approach because it allows for more granular controls about the transition itself, such as the range at which the transition occurs, rather than hitting a single checkpoint that scroll state seems to only support.