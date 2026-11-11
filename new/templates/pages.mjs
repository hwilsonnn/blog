export const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
})[char])

const tags = (values) => `<span class="tags">${values.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</span>`
const nav = (base) => `<nav><a href="${base}/"><img src="${base}/assets/home.gif" alt="Back to home" width="48" /></a></nav>`
const attributes = (title, description) => `data-title="${escapeHtml(title)} — hwilson.dev" data-description="${escapeHtml(description)}"`
const dateFormat = new Intl.DateTimeFormat("en-AU", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })

export function listing(collection, entries, base) {
  return `${nav(base)}
<section class="articles" ${attributes(collection.title, collection.description)}>
  <div class="page-box">
    <h1>${collection.title}</h1>
    <p class="listing-description">${entries.length} ${collection.description}</p>
    <div class="cards">${entries.map((entry, index) => `
      <article>
        <img src="${base}/assets/${escapeHtml(entry.gif ?? (index % 2 ? "breakdance.gif" : "dunking.gif"))}" alt="" width="100" loading="lazy" />
        <div>
          <a href="${base}/${collection.route}/${entry.slug}">${escapeHtml(entry.title)}</a>
          <div>${escapeHtml(entry.excerpt)}</div>
          ${tags(entry.tags)}
        </div>
      </article>`).join("")}
    </div>
  </div>
  <p class="footnote">&copy; 2001–${new Date().getUTCFullYear()} hwilson.dev — hand-coded in Notepad</p>
</section>`
}

export function detail(collection, entry, base) {
  const links = [entry.github && `<a href="${escapeHtml(entry.github)}">GitHub</a>`, entry.demo && `<a href="${escapeHtml(entry.demo)}">Live demo</a>`].filter(Boolean)
  return `${nav(base)}
<section class="article" ${attributes(entry.title, entry.excerpt)}>
  <div class="page-box">
    <p class="back-link"><a href="${base}/${collection.route}/">&laquo; Back to ${collection.title}</a></p>
    <h1>${escapeHtml(entry.title)}</h1>
    <div class="meta">
      Posted <time datetime="${entry.date}">${dateFormat.format(new Date(entry.date))}</time>
      ${tags(entry.tags)}
    </div>
    ${links.length ? `<p class="project-links">${links.join(" · ")}</p>` : ""}
    <div class="article-body">${entry.html}</div>
  </div>
</section>`
}

export function about(entry, base) {
  return `${nav(base)}
<section class="article" ${attributes("About Me", `${entry.name} — ${entry.title}`)}>
  <div class="page-box">
    <p class="profile">${escapeHtml(entry.name)} · ${escapeHtml(entry.title)} · ${escapeHtml(entry.location)}</p>
    <p class="project-links"><a href="mailto:${escapeHtml(entry.email)}">Email</a> · <a href="${escapeHtml(entry.github)}">GitHub</a> · <a href="${escapeHtml(entry.linkedin)}">LinkedIn</a></p>
    <div class="article-body">${entry.html}</div>
  </div>
</section>`
}
