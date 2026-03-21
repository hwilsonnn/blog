import { useParams, Navigate, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { RefObject, useRef } from "react"
import { getBlogBySlug } from "../utils/markdown"
import TableOfContents from "../components/TableOfContents"

export default function BlogPost() {
  const { slug } = useParams()
  const post = getBlogBySlug(slug)
  const articleRef = useRef<HTMLElement>(null)

  if (!post) return <Navigate to="/blog" replace />

  const isKnowledgeShare = post.frontmatter.tags?.includes("knowledge share")

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      {isKnowledgeShare ? (
        <div className="flex flex-col lg:grid lg:grid-cols-5 gap-12 lg:items-start">
          <div className="hidden lg:block lg:col-span-1 self-stretch">
            <TableOfContents articleRef={articleRef} />
          </div>

          <div className="lg:col-span-3 flex justify-center">
            <ArticleContent post={post} articleRef={articleRef} />
          </div>
        </div>
      ) : (
        <div className="flex justify-center">
          <ArticleContent post={post} articleRef={articleRef} />
        </div>
      )}
    </div>
  )
}

interface ArticleContentProps {
  post: ReturnType<typeof getBlogBySlug>
  articleRef: RefObject<HTMLElement | null>
}

function ArticleContent({ post, articleRef }: ArticleContentProps) {
  const navigate = useNavigate()
  if (!post) return null

  return (
    <div className="max-w-3xl w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 hover:underline mb-8"
        >
          ← Back to Blog
        </button>

        <div className="flex flex-wrap gap-2 mb-4">
          {post.frontmatter.tags?.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          {post.frontmatter.title}
        </h1>

        {post.frontmatter.date && (
          <p className="text-gray-500 dark:text-gray-400 mb-10">
            {new Date(post.frontmatter.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric"
            })}
          </p>
        )}

        <article
          ref={articleRef}
          className="prose prose-indigo dark:prose-invert max-w-none"
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </article>
      </motion.div>
    </div>
  )
}
