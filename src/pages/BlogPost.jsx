import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getBlogBySlug } from '../utils/markdown';

export default function BlogPost() {
  const { slug } = useParams();
  const post = getBlogBySlug(slug);

  if (!post) return <Navigate to="/blog" replace />;

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link
          to="/blog"
          className="inline-flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 hover:underline mb-8"
        >
          ← Back to Blog
        </Link>

        <div className="flex flex-wrap gap-2 mb-4">
          {post.frontmatter.tags?.map(tag => (
            <span key={tag} className="text-xs px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          {post.frontmatter.title}
        </h1>

        {post.frontmatter.date && (
          <p className="text-gray-500 dark:text-gray-400 mb-10">
            {new Date(post.frontmatter.date).toLocaleDateString('en-US', {
              year: 'numeric', month: 'long', day: 'numeric',
            })}
          </p>
        )}

        <article className="prose prose-indigo dark:prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </article>
      </motion.div>
    </div>
  );
}
