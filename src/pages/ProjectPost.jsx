import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getProjectBySlug } from '../utils/markdown';

export default function ProjectPost() {
  const { slug } = useParams();
  const project = getProjectBySlug(slug);

  if (!project) return <Navigate to="/projects" replace />;

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link
          to="/projects"
          className="inline-flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 hover:underline mb-8"
        >
          ← Back to Projects
        </Link>

        <div className="flex flex-wrap gap-2 mb-4">
          {project.frontmatter.tags?.map(tag => (
            <span key={tag} className="text-xs px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          {project.frontmatter.title}
        </h1>

        <div className="flex gap-4 mb-10">
          {project.frontmatter.github && (
            <a
              href={project.frontmatter.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
            >
              View on GitHub →
            </a>
          )}
          {project.frontmatter.demo && (
            <a
              href={project.frontmatter.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-purple-600 dark:text-purple-400 hover:underline font-medium"
            >
              Live Demo →
            </a>
          )}
        </div>

        <article className="prose prose-indigo dark:prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {project.content}
          </ReactMarkdown>
        </article>
      </motion.div>
    </div>
  );
}
