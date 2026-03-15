// Import all markdown files at build time using Vite's glob import
const blogFiles = import.meta.glob('../content/blogs/*.md', { query: '?raw', import: 'default', eager: true });
const projectFiles = import.meta.glob('../content/projects/*.md', { query: '?raw', import: 'default', eager: true });
const aboutFile = import.meta.glob('../content/about.md', { query: '?raw', import: 'default', eager: true });

/**
 * Browser-compatible YAML frontmatter parser.
 * Supports strings (quoted or unquoted), inline arrays, and empty values.
 */
function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return { data: {}, content: raw.trim() };

  const content = raw.slice(match[0].length).trim();
  const yamlStr = match[1];
  const data = {};

  for (const line of yamlStr.split('\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    if (!key) continue;
    let value = line.slice(colonIdx + 1).trim();

    if (/^["'].*["']$/.test(value)) {
      data[key] = value.slice(1, -1);
    } else if (value.startsWith('[') && value.endsWith(']')) {
      data[key] = value
        .slice(1, -1)
        .split(',')
        .map(s => s.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean);
    } else if (value) {
      data[key] = value;
    }
  }

  return { data, content };
}

function parseMarkdownFiles(files) {
  return Object.entries(files)
    .map(([path, raw]) => {
      const { data, content } = parseFrontmatter(raw);
      const slug = path.split('/').pop().replace('.md', '');
      return { slug, frontmatter: data, content };
    })
    .sort((a, b) => {
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
  const { data, content } = parseFrontmatter(raw);
  return { frontmatter: data, content };
}
