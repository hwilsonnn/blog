// The only application code shipped to the browser. Content is already HTML.
const BASE_PATH = document.querySelector('meta[name="app-base"]').content
const rootEl = document.querySelector("main#root")
const description = document.querySelector('meta[name="description"]')
const routeMap = {
  "/": "home.html",
  "/articles": "articles/index.html",
  "/projects": "projects/index.html",
  "/about": "about.html",
}
const inApp = (path) => !BASE_PATH || path === BASE_PATH || path.startsWith(BASE_PATH + "/")
const normalizePath = (path) => path.slice(BASE_PATH.length).replace(/\/+$/, "") || "/"
let requestId = 0

function showNotFound() {
  document.title = "404 — hwilson.dev"
  description.content = "The page you're looking for doesn't exist."
  rootEl.innerHTML = `<section class="not-found"><h1>404 — Page Not Found</h1><p><a href="${BASE_PATH}/">Click here to go back home</a></p></section>`
}

function scrollToLocation() {
  let anchor
  try { anchor = document.getElementById(decodeURIComponent(location.hash.slice(1))) } catch {}
  if (anchor) anchor.scrollIntoView()
  else window.scrollTo(0, 0)
}

async function loadRoute() {
  const id = ++requestId
  const target = normalizePath(location.pathname)
  const file = Object.hasOwn(routeMap, target) ? routeMap[target] : /^\/[a-z0-9-]+(?:\/[a-z0-9-]+)*$/.test(target) ? target.slice(1) + ".html" : null
  if (!file || !inApp(location.pathname)) {
    showNotFound()
    rootEl.removeAttribute("aria-busy")
    scrollToLocation()
    return
  }
  rootEl.setAttribute("aria-busy", "true")
  try {
    const response = await fetch(`${BASE_PATH}/routes/${file}`)
    if (!response.ok) throw new Error("Route unavailable")
    const html = await response.text()
    if (id !== requestId) return
    rootEl.innerHTML = html
    const page = rootEl.querySelector("[data-title]")
    if (!page) throw new Error("Missing route content")
    document.title = page.dataset.title
    description.content = page.dataset.description || ""
  } catch {
    if (id !== requestId) return
    showNotFound()
  } finally {
    if (id === requestId) rootEl.removeAttribute("aria-busy")
  }
  if (id === requestId) {
    rootEl.focus({ preventScroll: true })
    scrollToLocation()
  }
}

document.addEventListener("click", (event) => {
  if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return
  const link = event.target instanceof Element ? event.target.closest("a") : null
  if (!link || !link.hasAttribute("href") || link.hasAttribute("download") || (link.target && link.target !== "_self")) return
  const url = new URL(link.href, location.href)
  if (url.origin !== location.origin || !inApp(url.pathname)) return
  // Files and external protocols keep their native browser behavior.
  if (/\.[^/]+$/.test(url.pathname)) return
  event.preventDefault()
  const samePage = url.pathname === location.pathname && url.search === location.search
  history.pushState({}, "", url.pathname + url.search + url.hash)
  if (samePage) scrollToLocation()
  else loadRoute()
})

window.addEventListener("popstate", loadRoute)

// Restore the clean URL after the static host's 404 redirect.
const bouncedPath = new URLSearchParams(location.search).get("p")
if (bouncedPath) {
  try {
    const url = new URL(bouncedPath, location.origin)
    if (url.origin === location.origin && inApp(url.pathname)) {
      const path = normalizePath(url.pathname)
      const suffix = Object.hasOwn(routeMap, path) && path !== "/" ? "/" : ""
      history.replaceState({}, "", BASE_PATH + path + suffix + url.search + url.hash)
    }
  } catch {}
}
loadRoute()
