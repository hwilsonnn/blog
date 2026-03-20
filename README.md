# hwilson.dev — Personal Blog & Portfolio

A personal portfolio and blog site built with React, Vite, and Tailwind CSS. The site serves as a hub for blog posts and project showcases, with content authored in Markdown and rendered at runtime.

## Features

- **Blog** — Articles with tag-based filtering, syntax-highlighted code blocks, and auto-generated tables of contents for longer posts.
- **Projects** — A grid of side-project cards with links to GitHub repositories and live demos.
- **About** — A personal introduction page.
- **Dark / Light Theme** — Toggle between themes, with preference persisted in `localStorage` and automatic detection of the system default.
- **Responsive Design** — Mobile-first layout with breakpoints for all screen sizes.
- **Markdown Content** — Posts and project descriptions are written as `.md` files with YAML frontmatter (title, date, excerpt, tags, github, demo).
- **Smooth Animations** — Page and list transitions powered by Framer Motion.

## Tech Stack

| Area | Technology |
|---|---|
| Framework | React 19, React Router 7 |
| Build tool | Vite 8 |
| Styling | Tailwind CSS 3, `@tailwindcss/typography` |
| Animations | Framer Motion |
| Markdown | `react-markdown`, `remark-gfm`, `rehype-highlight` |
| Icons | `@heroicons/react` |
| Language | TypeScript |
| Linting | ESLint + `typescript-eslint` |

## Project Structure

```
src/
├── components/       # Navbar, TableOfContents, BackToTopButton
├── pages/            # Home, Blog, BlogPost, Projects, ProjectPost, About, NotFound
├── content/
│   ├── blogs/        # Markdown blog posts
│   ├── projects/     # Markdown project descriptions
│   └── about.md      # About page content
├── hooks/            # useTheme (dark/light mode)
├── utils/            # Markdown parsing helpers
├── App.tsx           # Router setup
└── main.tsx          # Entry point
```

## Getting Started

```bash
# Install dependencies
npm install

# Start the development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview the production build
npm run preview
```

## Adding Content

**Blog post** — create `src/content/blogs/<slug>.md` with frontmatter:

```markdown
---
title: "Post Title"
date: "YYYY-MM-DD"
excerpt: "Short description shown on the blog listing page."
tags: ["tag1", "tag2"]
---

Post body here…
```

**Project** — create `src/content/projects/<slug>.md` with frontmatter:

```markdown
---
title: "Project Name"
date: "YYYY-MM-DD"
excerpt: "Short description shown on the projects page."
tags: ["tag1"]
github: "https://github.com/..."
demo: "https://..."
---

Project description here…
```
