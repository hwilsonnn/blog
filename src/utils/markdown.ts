// Import all markdown files at build time using Vite's glob import
const blogFiles = import.meta.glob("../content/blogs/*.md", {
  query: "?raw",
  import: "default",
  eager: true
})
const projectFiles = import.meta.glob("../content/projects/*.md", {
  query: "?raw",
  import: "default",
  eager: true
})
const aboutFile = import.meta.glob("../content/about.md", {
  query: "?raw",
  import: "default",
  eager: true
})

export interface Frontmatter {
  title?: string
  date?: string
  excerpt?: string
  tags?: string[]
  github?: string
  demo?: string
  name?: string
  location?: string
  linkedin?: string
  email?: string
  [key: string]: string | string[] | undefined
}

export interface Post {
  slug: string
  frontmatter: Frontmatter
  content: string
}

/**
 * Browser-compatible YAML frontmatter parser.
 * Supports strings (quoted or unquoted), inline arrays, and empty values.
 */
export function parseFrontmatter(raw: string): {
  data: Frontmatter
  content: string
} {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
  if (!match) return { data: {}, content: raw.trim() }

  const content = raw.slice(match[0].length).trim()
  const yamlStr = match[1]
  const data: Frontmatter = {}

  for (const line of yamlStr.split("\n")) {
    const colonIdx = line.indexOf(":")
    if (colonIdx === -1) continue
    const key = line.slice(0, colonIdx).trim()
    if (!key) continue
    let value = line.slice(colonIdx + 1).trim()

    if (/^["'].*["']$/.test(value)) {
      data[key] = value.slice(1, -1)
    } else if (value.startsWith("[") && value.endsWith("]")) {
      data[key] = value
        .slice(1, -1)
        .split(",")
        .map((s) => s.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean)
    } else if (value) {
      data[key] = value
    }
  }

  return { data, content }
}

function parseMarkdownFiles(files: Record<string, unknown>): Post[] {
  return Object.entries(files)
    .map(([path, raw]) => {
      const { data, content } = parseFrontmatter(raw as string)
      const slug = path.split("/").pop()!.replace(".md", "")
      return { slug, frontmatter: data, content }
    })
    .sort((a, b) => {
      if (a.frontmatter.date && b.frontmatter.date) {
        return (
          new Date(b.frontmatter.date).getTime() -
          new Date(a.frontmatter.date).getTime()
        )
      }
      return 0
    })
}

// Cache parsed results at module level — data is static (eager Vite imports)
const cachedBlogs = parseMarkdownFiles(blogFiles)
const cachedProjects = parseMarkdownFiles(projectFiles)
const cachedAbout: { frontmatter: Frontmatter; content: string } | null =
  (() => {
    const entries = Object.entries(aboutFile)
    if (!entries.length) return null
    const [, raw] = entries[0]
    const { data, content } = parseFrontmatter(raw as string)
    return { frontmatter: data, content }
  })()

export function getAllBlogs(): Post[] {
  return cachedBlogs
}

export function getBlogBySlug(slug: string | undefined): Post | undefined {
  return cachedBlogs.find((b) => b.slug === slug)
}

export function getAllProjects(): Post[] {
  return cachedProjects
}

export function getProjectBySlug(slug: string | undefined): Post | undefined {
  return cachedProjects.find((p) => p.slug === slug)
}

export function getAbout(): {
  frontmatter: Frontmatter
  content: string
} | null {
  return cachedAbout
}
