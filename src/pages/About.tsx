import { motion } from "framer-motion"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { getAbout } from "../utils/markdown"

export default function About() {
  const about = getAbout()

  if (!about)
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        About page coming soon.
      </div>
    )

  const { frontmatter, content } = about

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Profile header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-10 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <img
            src="/profile.jpeg"
            alt={frontmatter.name || "Profile"}
            className="w-20 h-20 rounded-full object-cover flex-shrink-0"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {frontmatter.name}
            </h1>
            <p className="text-indigo-600 dark:text-indigo-400 font-medium">
              {frontmatter.title}
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              {frontmatter.location}
            </p>
            <div className="flex gap-4 mt-3">
              {frontmatter.github && (
                <a
                  href={frontmatter.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  GitHub
                </a>
              )}
              {frontmatter.linkedin && (
                <a
                  href={frontmatter.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  LinkedIn
                </a>
              )}
              {frontmatter.email && (
                <a
                  href={`mailto:${frontmatter.email}`}
                  className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Email
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Resume content */}
        <article className="prose prose-indigo dark:prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </article>
      </motion.div>
    </div>
  )
}
