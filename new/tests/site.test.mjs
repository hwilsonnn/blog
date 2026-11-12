import assert from "node:assert/strict"
import { cp, readFile, readdir, stat, writeFile, rm } from "node:fs/promises"
import { resolve } from "node:path"
import { test } from "node:test"
import { runInNewContext } from "node:vm"
import { JSDOM, VirtualConsole } from "jsdom"
import { build, normalizeBase, parseContent, root } from "../scripts/build.mjs"

const output = resolve(root, ".test-output")
const read = (file) => readFile(resolve(output, file), "utf8")
const fixture = '---\ntitle: "Example"\ndate: "2026-11-09"\ntags: ["notes"]\nexcerpt: "A summary"\n---\n\n## Content\n\nHello'
const waitFor = async (predicate) => {
  for (let attempt = 0; attempt < 200; attempt++) {
    if (predicate()) return
    await new Promise((done) => setTimeout(done, 5))
  }
  assert.fail("Timed out waiting for route")
}

test("invalid metadata fails with a useful filename and field", () => {
  assert.equal(parseContent(fixture, "post.md").title, "Example")
  for (const [source, message] of [
    [fixture.replace('title: "Example"', 'title: ""'), /post.md: title/],
    [fixture.replace("2026-11-09", "2026-02-30"), /post.md: date/],
    [fixture.replace('["notes"]', '"notes"'), /post.md: tags/],
    [fixture.replace("excerpt:", 'demo: "javascript:alert(1)"\nexcerpt:'), /post.md: demo/],
    ...['"../outside.gif"', '"photo.png"', '42', '""'].map((gif) => [fixture.replace("excerpt:", `gif: ${gif}\nexcerpt:`), /post.md: gif/]),
    ["---js\nthrow new Error('never execute')\n---\nbody", /expected YAML/],
  ]) assert.throws(() => parseContent(source, "post.md"), message)
  assert.equal(normalizeBase("/blog/"), "/blog")
  for (const base of ["blog", "//host", "/../site", '/blog"']) assert.throws(() => normalizeBase(base))
})

test("build and SPA behavior at both deployment paths", async (t) => {
  t.after(() => rm(output, { recursive: true, force: true }))
  for (const base of ["", "/blog"]) {
    await t.test(base || "/", async (t) => {
      const result = await build({ basePath: base, outputDirectory: output })
      const blogCount = (await readdir(resolve(root, "content/blogs"))).filter((file) => file.endsWith(".md")).length
      const projectCount = (await readdir(resolve(root, "content/projects"))).filter((file) => file.endsWith(".md")).length
      assert.equal(result.files.length, blogCount + projectCount + 6)
      const listing = new JSDOM(await read("routes/articles/index.html"))
      assert.equal(listing.window.document.querySelectorAll("article").length, blogCount)
      assert.match(listing.window.document.querySelector("article a").href, /url-pattern$/)
      assert.equal(listing.window.document.querySelector("article img").getAttribute("src"), `${base}/assets/breakdance.gif`)
      listing.window.close()
      const projects = new JSDOM(await read("routes/projects/index.html"))
      const editorCard = projects.window.document.querySelector(`a[href="${base}/projects/md-editor"]`).closest("article")
      assert.equal(editorCard.querySelector("img").getAttribute("src"), `${base}/assets/dunking.gif`)
      const defaultCard = projects.window.document.querySelector("article")
      assert.equal(defaultCard.querySelector("img").getAttribute("src"), `${base}/assets/dunking.gif`)
      projects.window.close()
      assert.match(await read("routes/articles/conflict-free-replicated-data-types.html"), /<table>/)
      assert.match(await read("routes/articles/url-pattern.html"), /<pre><code class="language-javascript">/)
      assert.match(await read("routes/articles/frontend-unit-testing-vue.html"), /&lt;dialog/)
      assert.match(await read("routes/articles/web-assembly.html"), /id="intro"/)
      assert.doesNotMatch(await read("routes/projects/uwuify-extension.html"), /Live demo/)

      // Every generated internal link resolves to either an app route or an asset.
      for (const file of result.files) {
        const html = await read(file)
        assert.doesNotMatch(html, /\{\{base\}\}/)
        if (file.startsWith("routes/")) assert.doesNotMatch(html, /<script\b|<style\b|<!doctype/i)
        const dom = new JSDOM(html)
        for (const element of dom.window.document.querySelectorAll("[href], [src]")) {
          const value = element.getAttribute("href") || element.getAttribute("src")
          if (!value.startsWith("/") || value.startsWith("//")) continue
          assert.ok(value.startsWith(base + "/"), `${file}: ${value}`)
          const path = value.slice(base.length).replace(/\/$/, "") || "/"
          const known = { "/": "index.html", "/articles": "routes/articles/index.html", "/projects": "routes/projects/index.html", "/about": "routes/about.html" }
          const target = known[path] || (/\.[^/]+$/.test(path) ? path.slice(1) : `routes${path}.html`)
          assert.ok((await stat(resolve(output, target))).isFile(), `${file}: missing ${target}`)
        }
        dom.window.close()
      }
      assert.deepEqual((await readdir(output)).filter((file) => file.endsWith(".js")), ["router.js"])

      // Supply built files directly to the router; no test HTTP server is needed.
      const origin = "https://example.test"
      const responses = new Map(await Promise.all(result.files.map(async (file) => [`${base}/${file}`, await read(file)])))
      const fetchFile = async (url) => {
        const path = new URL(url, origin).pathname
        return new Response(responses.get(path) ?? "Not found", { status: responses.has(path) ? 200 : 404 })
      }
      const deepPath = `${base}/articles/web-assembly?ref=test#intro`
      const fallback = new JSDOM(await read("404.html"))
      let redirect
      runInNewContext(fallback.window.document.querySelector("script").textContent, {
        location: { pathname: `${base}/articles/web-assembly`, search: "?ref=test", hash: "#intro", replace: (value) => { redirect = value } },
        encodeURIComponent,
      })
      fallback.window.close()
      assert.equal(redirect, `${base}/?p=${encodeURIComponent(deepPath)}`)

      const jsErrors = []
      const virtualConsole = new VirtualConsole()
      virtualConsole.on("jsdomError", (error) => {
        // jsdom cannot perform native document navigation; router interception is asserted separately.
        if (!error.message.includes("navigation")) jsErrors.push(error)
      })
      const dom = new JSDOM(await read("index.html"), { url: origin + redirect, runScripts: "outside-only", pretendToBeVisual: true, virtualConsole })
      t.after(() => dom.window.close())
      const { window } = dom
      const document = window.document
      const calls = []
      window.scrollTo = () => {}
      window.HTMLElement.prototype.scrollIntoView = function () { window.lastAnchor = this.id }
      window.fetch = (url) => { calls.push(url); return fetchFile(url) }
      window.eval(await read("router.js"))
      const settled = (title) => waitFor(() => document.title === title && !document.querySelector("main").hasAttribute("aria-busy"))
      await settled("WebAssembly — hwilson.dev")
      assert.equal(window.location.pathname + window.location.search + window.location.hash, deepPath)
      assert.equal(window.lastAnchor, "intro")
      assert.equal(calls[0], `${base}/routes/articles/web-assembly.html`)
      assert.equal(document.querySelector('meta[name="description"]').content, "Why use Web Assembly")

      const click = (element, options = {}) => {
        const event = new window.MouseEvent("click", { bubbles: true, cancelable: true, button: 0, ...options })
        element.dispatchEvent(event)
        return event.defaultPrevented
      }
      assert.ok(click(document.querySelector(".back-link a")))
      await settled("Articles — hwilson.dev")
      assert.ok(click(document.querySelector("article a")))
      await settled("URL Pattern API — hwilson.dev")
      window.history.back()
      await settled("Articles — hwilson.dev")
      window.history.forward()
      await settled("URL Pattern API — hwilson.dev")

      assert.ok(click(document.querySelector("nav a")))
      await settled("hwilson.dev")
      assert.ok(click(document.querySelector(`a[href="${base}/projects/"]`)))
      await settled("Projects — hwilson.dev")
      assert.equal(document.querySelectorAll("article").length, projectCount)
      assert.ok(click(document.querySelector(`a[href="${base}/projects/md-editor"]`)))
      await settled("Markdown Editor — hwilson.dev")

      // Browser-native link behavior must not be swallowed by the router.
      const link = document.createElement("a")
      document.body.append(link)
      for (const [href, attributes, options] of [
        ["mailto:test@example.com", {}, {}], ["https://example.com", {}, {}],
        [`${base}/articles/`, {}, { ctrlKey: true }], [`${base}/articles/`, { target: "_blank" }, {}],
        [`${base}/assets/home.gif`, {}, {}], [`${base}/articles/`, { download: "" }, {}],
        ...(base ? [["/another-app/", {}, {}]] : []),
      ]) {
        link.removeAttribute("target")
        link.removeAttribute("download")
        link.href = href
        for (const [key, value] of Object.entries(attributes)) link.setAttribute(key, value)
        const before = window.location.href
        assert.equal(click(link, options), false, href)
        assert.equal(window.location.href, before)
      }
      link.removeAttribute("download")
      link.href = `${base}/about/`
      assert.ok(click(link))
      await settled("About Me — hwilson.dev")
      assert.match(document.querySelector(".article-body").textContent, /Career History/)

      // A slow response must not overwrite a newer navigation.
      let release
      window.fetch = (url) => url.endsWith("articles/url-pattern.html")
        ? new Promise((done) => { release = () => done(new Response('<section data-title="STALE"></section>')) })
        : fetchFile(url)
      link.href = `${base}/articles/url-pattern`
      click(link)
      link.href = `${base}/projects/`
      click(link)
      await settled("Projects — hwilson.dev")
      release()
      await new Promise((done) => setTimeout(done, 10))
      assert.equal(document.title, "Projects — hwilson.dev")
      link.href = `${base}/does-not-exist`
      click(link)
      await settled("404 — hwilson.dev")
      assert.match(document.querySelector("main").textContent, /Page Not Found/)
      assert.deepEqual(jsErrors, [])
    })
  }
  // A rebuild removes stale routes without touching source content.
  await writeFile(resolve(output, "routes/obsolete.html"), "stale")
  await build({ outputDirectory: output })
  await assert.rejects(stat(resolve(output, "routes/obsolete.html")), { code: "ENOENT" })
  // A missing chosen asset must fail before replacing the last successful build.
  const fixtureContent = resolve(output, "fixture-content")
  await cp(resolve(root, "content"), fixtureContent, { recursive: true })
  const post = resolve(fixtureContent, "blogs/url-pattern.md")
  await writeFile(post, (await readFile(post, "utf8")).replace('gif: "breakdance.gif"', 'gif: "missing-test-asset.gif"'))
  const previousListing = await read("routes/articles/index.html")
  await assert.rejects(build({ contentDirectory: fixtureContent, outputDirectory: output }), /url-pattern.md: GIF asset not found: assets\/missing-test-asset.gif/)
  assert.equal(await read("routes/articles/index.html"), previousListing)
})
