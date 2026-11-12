import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import { parseArgs } from "node:util"
import MarkdownIt from "markdown-it"
import matter from "gray-matter"
import { about, detail, listing } from "../templates/pages.mjs"

export const root = fileURLToPath(new URL("../", import.meta.url))
export const collections = [
  { directory: "blogs", route: "articles", title: "Articles", description: "posts about web development, tools, and lessons learned." },
  { directory: "projects", route: "projects", title: "Projects", description: "projects, experiments, and things I've built." },
]

export function normalizeBase(value) {
  if (value === "" || value === "/") return ""
  if (!/^\/(?:[a-zA-Z0-9_-]+\/)*[a-zA-Z0-9_-]+\/?$/.test(value)) {
    throw new Error("Base path must be / or a path such as /blog")
  }
  return value.replace(/\/$/, "")
}

export function parseContent(source, filename, profile = false) {
  if (!/^---\r?\n/.test(source)) throw new Error(`${filename}: expected YAML front matter`)
  const { data, content } = matter(source)
  const required = profile ? ["name", "title", "location", "email", "github", "linkedin"] : ["title", "date", "excerpt"]
  for (const key of required) {
    if (typeof data[key] !== "string" || !data[key].trim()) throw new Error(`${filename}: ${key} must be a non-empty string`)
  }
  if (!profile) {
    if (data.gif !== undefined && (typeof data.gif !== "string" || !/^[a-zA-Z0-9][a-zA-Z0-9._-]*\.gif$/i.test(data.gif))) {
      throw new Error(`${filename}: gif must be a filename such as breakdance.gif (inside assets/)`)
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date) || Number.isNaN(Date.parse(data.date)) || new Date(data.date).toISOString().slice(0, 10) !== data.date) {
      throw new Error(`${filename}: date must be a valid quoted YYYY-MM-DD date`)
    }
    if (!Array.isArray(data.tags) || data.tags.some((tag) => typeof tag !== "string" || !tag.trim())) {
      throw new Error(`${filename}: tags must be an array of strings`)
    }
  }
  for (const key of ["github", "demo", "linkedin"]) {
    if (data[key] !== undefined && data[key] !== "") {
      if (typeof data[key] !== "string" || !/^https?:\/\//.test(data[key])) throw new Error(`${filename}: ${key} must be an HTTP(S) URL`)
      try { new URL(data[key]) } catch { throw new Error(`${filename}: invalid ${key} URL`) }
    }
  }
  if (!content.trim()) throw new Error(`${filename}: Markdown body is empty`)
  return { ...data, content }
}

function markdown(base) {
  const md = new MarkdownIt({ html: false, linkify: true })
  md.renderer.rules.heading_open = (tokens, index, options, env, renderer) => {
    const text = tokens[index + 1].children.filter((token) => ["text", "code_inline"].includes(token.type)).map((token) => token.content).join("")
    const slug = text.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, "").trim().replace(/\s+/g, "-") || "section"
    env.headingIds ??= new Set()
    let id = slug
    for (let suffix = 2; env.headingIds.has(id); suffix++) id = `${slug}-${suffix}`
    env.headingIds.add(id)
    tokens[index].attrSet("id", id)
    return renderer.renderToken(tokens, index, options)
  }
  // Root-relative links/assets in Markdown are relative to this deployment.
  for (const [rule, attribute] of [["link_open", "href"], ["image", "src"]]) {
    const original = md.renderer.rules[rule]
    md.renderer.rules[rule] = (tokens, index, options, env, renderer) => {
      const value = tokens[index].attrGet(attribute)
      if (value?.startsWith("/") && !value.startsWith("//")) tokens[index].attrSet(attribute, base + value)
      return original ? original(tokens, index, options, env, renderer) : renderer.renderToken(tokens, index, options)
    }
  }
  return md
}

export async function build({ basePath = "", contentDirectory = resolve(root, "content"), outputDirectory = resolve(root, "dist") } = {}) {
  const base = normalizeBase(basePath)
  const output = resolve(outputDirectory)
  // Only these disposable build directories can ever be cleaned.
  if (![resolve(root, "dist"), resolve(root, ".test-output")].includes(output)) throw new Error("Output must be dist/ or .test-output/ in this project")
  const md = markdown(base)
  const files = new Map()
  const assets = new Set((await readdir(resolve(root, "assets"), { withFileTypes: true })).filter((entry) => entry.isFile()).map((entry) => entry.name))
  for (const collection of collections) {
    const entries = []
    const directory = resolve(contentDirectory, collection.directory)
    for (const filename of (await readdir(directory)).filter((name) => name.endsWith(".md")).sort()) {
      const slug = filename.slice(0, -3)
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || slug === "index") throw new Error(`${filename}: use a lowercase kebab-case filename other than index.md`)
      const entry = parseContent(await readFile(resolve(directory, filename), "utf8"), filename)
      if (entry.gif && !assets.has(entry.gif)) throw new Error(`${filename}: GIF asset not found: assets/${entry.gif}`)
      entries.push({ ...entry, slug, html: md.render(entry.content) })
    }
    entries.sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug))
    files.set(`routes/${collection.route}/index.html`, listing(collection, entries, base))
    for (const entry of entries) files.set(`routes/${collection.route}/${entry.slug}.html`, detail(collection, entry, base))
  }
  const profile = parseContent(await readFile(resolve(contentDirectory, "about.md"), "utf8"), "about.md", true)
  files.set("routes/about.html", about({ ...profile, html: md.render(profile.content) }, base))
  for (const [source, destination] of [["templates/home.html", "routes/home.html"], ["index.html", "index.html"], ["404.html", "404.html"]]) {
    files.set(destination, (await readFile(resolve(root, source), "utf8")).replaceAll("{{base}}", base))
  }
  // Validate all content before replacing a previous successful build.
  await rm(output, { recursive: true, force: true })
  for (const [filename, html] of files) {
    const destination = resolve(output, filename)
    await mkdir(dirname(destination), { recursive: true })
    await writeFile(destination, html + "\n")
  }
  for (const filename of ["index.css", "favicon.svg", "router.js", "assets"]) await cp(resolve(root, filename), resolve(output, filename), { recursive: true })
  await writeFile(resolve(output, ".nojekyll"), "")
  return { base, files: [...files.keys()] }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const { values } = parseArgs({ options: { base: { type: "string", default: "" } } })
    const result = await build({ basePath: values.base })
    console.log(`Built ${result.files.length} HTML files in dist/ for ${result.base || "/"}`)
  } catch (error) {
    console.error(error.message)
    process.exitCode = 1
  }
}
