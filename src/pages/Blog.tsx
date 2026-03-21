import { Link, useSearchParams } from "react-router-dom"
import { motion } from "framer-motion"
import { getAllBlogs } from "../utils/markdown"

export default function Blog() {
  const allBlogs = getAllBlogs()
  const allTags = [
    "All",
    ...new Set(allBlogs.flatMap((b) => b.frontmatter.tags || []))
  ]
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTag = searchParams.get("tag") || "All"

  const setActiveTag = (tag: string) => {
    if (tag === "All") {
      setSearchParams({}, { replace: true })
    } else {
      setSearchParams({ tag }, { replace: true })
    }
  }

  const filtered =
    activeTag === "All"
      ? allBlogs
      : allBlogs.filter((b) => b.frontmatter.tags?.includes(activeTag))

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-2">Blog</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-10">
          {allBlogs.length} posts about web development, tools, and lessons
          learned.
        </p>
      </motion.div>

      {/* Tag filter */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-2 mb-10"
      >
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              activeTag === tag
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {tag}
          </button>
        ))}
      </motion.div>

      {/* Blog list */}
      <div className="space-y-4">
        {filtered.map((blog, i) => (
          <motion.div
            key={blog.slug}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          >
            <Link
              to={`/blog/${blog.slug}`}
              className="flex flex-col sm:flex-row sm:items-center gap-4 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all hover:shadow-md group"
            >
              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-2">
                  {blog.frontmatter.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {blog.frontmatter.title}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  {blog.frontmatter.excerpt}
                </p>
              </div>
              <div className="text-sm text-gray-400 dark:text-gray-500 whitespace-nowrap">
                {blog.frontmatter.date &&
                  new Date(blog.frontmatter.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric"
                  })}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
