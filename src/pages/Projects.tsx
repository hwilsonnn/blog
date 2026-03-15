import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getAllProjects } from '../utils/markdown';

export default function Projects() {
  const projects = getAllProjects();

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-2">Projects</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-10">
          Things I've built, experiments, and side projects.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 gap-6">
        {projects.map((project, i) => (
          <motion.div
            key={project.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <Link
              to={`/projects/${project.slug}`}
              className="flex flex-col p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all hover:shadow-lg hover:-translate-y-1 h-full group"
            >
              <div className="flex flex-wrap gap-2 mb-3">
                {project.frontmatter.tags?.map(tag => (
                  <span key={tag} className="text-xs px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors mb-2">
                {project.frontmatter.title}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm flex-1">
                {project.frontmatter.excerpt}
              </p>
              <div className="mt-4 flex gap-3">
                {project.frontmatter.github && (
                  <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">GitHub →</span>
                )}
                {project.frontmatter.demo && (
                  <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">Live Demo →</span>
                )}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
