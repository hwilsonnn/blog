---
title: "Implementing Dark Mode with Tailwind CSS"
date: "2024-03-05"
tags: ["tailwind", "css", "dark-mode"]
excerpt: "A complete guide to adding a beautiful dark mode to your Tailwind CSS project."
---

Dark mode is no longer optional. Here's how to do it right with Tailwind.

## Setup

Enable `darkMode: 'class'` in your `tailwind.config.js`:

```js
export default {
  darkMode: 'class',
  // ...
}
```

## The Theme Toggle

Use JavaScript to toggle the `dark` class on `<html>`:

```js
function toggleDark() {
  document.documentElement.classList.toggle('dark');
  localStorage.setItem(
    'theme',
    document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  );
}
```

## Persisting the Preference

Read from localStorage on load:

```js
if (
  localStorage.theme === 'dark' ||
  (!localStorage.theme && window.matchMedia('(prefers-color-scheme: dark)').matches)
) {
  document.documentElement.classList.add('dark');
}
```

## Styling with Dark Mode

Use the `dark:` prefix for dark-mode styles:

```html
<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  Hello!
</div>
```

That's it! Dark mode in 15 minutes. ✨
