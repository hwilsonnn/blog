---
title: "5 React Patterns That Changed How I Code"
date: "2024-02-10"
tags: ["react", "javascript", "patterns"]
excerpt: "After years of React development, these five patterns have had the biggest impact on my code quality."
---

React is flexible — sometimes too flexible. Here are five patterns I keep returning to.

## 1. Compound Components

Instead of a bloated props API, use compound components to let users compose UI naturally.

```jsx
<Tabs>
  <Tabs.List>
    <Tabs.Tab>First</Tabs.Tab>
    <Tabs.Tab>Second</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel>Content 1</Tabs.Panel>
  <Tabs.Panel>Content 2</Tabs.Panel>
</Tabs>
```

## 2. Custom Hooks for Everything

Extract logic into hooks. Makes components cleaner and logic reusable.

```js
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
```

## 3. The Render Props Pattern (Still Useful!)

Render props are underrated. They shine when you need to share stateful logic with flexible rendering.

## 4. Error Boundaries

Wrap sections of your app in Error Boundaries. Don't let one component crash the whole UI.

## 5. Memoization — But Only When Needed

`useMemo` and `useCallback` are tools, not defaults. Profile first, optimize second.

---

Which patterns do you use most? Let me know!
