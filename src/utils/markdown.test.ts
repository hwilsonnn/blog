import { describe, it, expect } from "vitest"
import { parseFrontmatter } from "./markdown"

describe("parseFrontmatter", () => {
  it("returns empty data and the raw string when there is no frontmatter", () => {
    const raw = "Hello world"
    const { data, content } = parseFrontmatter(raw)
    expect(data).toEqual({})
    expect(content).toBe("Hello world")
  })

  it("parses string values from frontmatter", () => {
    const raw = `---\ntitle: My Post\ndate: 2024-01-01\n---\nBody text`
    const { data, content } = parseFrontmatter(raw)
    expect(data.title).toBe("My Post")
    expect(data.date).toBe("2024-01-01")
    expect(content).toBe("Body text")
  })

  it("parses quoted string values", () => {
    const raw = `---\ntitle: "Hello, World"\n---\nContent`
    const { data } = parseFrontmatter(raw)
    expect(data.title).toBe("Hello, World")
  })

  it("parses inline array values", () => {
    const raw = `---\ntags: [react, typescript, testing]\n---\nContent`
    const { data } = parseFrontmatter(raw)
    expect(data.tags).toEqual(["react", "typescript", "testing"])
  })

  it("parses inline array with quoted items", () => {
    const raw = `---\ntags: ["web dev", "open source"]\n---\nContent`
    const { data } = parseFrontmatter(raw)
    expect(data.tags).toEqual(["web dev", "open source"])
  })

  it("strips the frontmatter block from the returned content", () => {
    const raw = `---\ntitle: Test\n---\nActual content here`
    const { content } = parseFrontmatter(raw)
    expect(content).toBe("Actual content here")
    expect(content).not.toContain("---")
  })
})
