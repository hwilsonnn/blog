import matter from 'gray-matter';

// Import all blog markdown files at build time
const blogFiles = import.meta.glob('../content/blogs/*.md', { query: '?raw', import: 'default', eager: true });
const projectFiles = import.meta.glob('../content/projects/*.md', { query: '?raw', import: 'default', eager: true });
const aboutFile = import.meta.glob('../content/about.md', { query: '?raw', import: 'default', eager: true });

function parseMarkdownFiles(files) {
  return Object.entries(files).map(([path, raw]) => {
    const { data, content } = matter(raw);
    const slug = path.split('/').pop().replace('.md', '');
    return { slug, frontmatter: data, content };
  }).sort((a, b) => {
    if (a.frontmatter.date && b.frontmatter.date) {
      return new Date(b.frontmatter.date) - new Date(a.frontmatter.date);
    }
    return 0;
  });
}

export function getAllBlogs() {
  return parseMarkdownFiles(blogFiles);
}

export function getBlogBySlug(slug) {
  return getAllBlogs().find(b => b.slug === slug);
}

export function getAllProjects() {
  return parseMarkdownFiles(projectFiles);
}

export function getProjectBySlug(slug) {
  return getAllProjects().find(p => p.slug === slug);
}

export function getAbout() {
  const entries = Object.entries(aboutFile);
  if (!entries.length) return null;
  const [, raw] = entries[0];
  const { data, content } = matter(raw);
  return { frontmatter: data, content };
}
