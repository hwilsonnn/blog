import { motion, type Variants, type TargetAndTransition } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getAllBlogs } from '../utils/markdown';

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const float: TargetAndTransition = {
  y: [0, -10, 0],
  transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
};

export default function Home() {
  const recentBlogs = getAllBlogs().slice(0, 3);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32 px-4">
        {/* Background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-indigo-300/20 dark:bg-indigo-500/10 blur-3xl"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [0, -5, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-purple-300/20 dark:bg-purple-500/10 blur-3xl"
          />
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative max-w-5xl mx-auto text-center"
        >
          <motion.div variants={item} animate={float} className="text-6xl mb-6 inline-block">
            👋
          </motion.div>

          <motion.h1
            variants={item}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
          >
            Hey, I'm hwilson
          </motion.h1>

          <motion.p
            variants={item}
            className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10"
          >
            Full Stack Developer. I write about web development, share my projects, and document my journey as a builder.
          </motion.p>

          <motion.div variants={item} className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/blog"
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/25"
            >
              Read the Blog
            </Link>
            <Link
              to="/projects"
              className="px-8 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-xl border border-gray-200 dark:border-gray-700 transition-all hover:scale-105 hover:shadow-lg"
            >
              See Projects
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Tech Stack Marquee */}
      <section className="py-10 overflow-hidden border-y border-gray-100 dark:border-gray-800">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="flex gap-12 whitespace-nowrap"
        >
          {['React', 'TypeScript', 'Node.js', 'Tailwind CSS', 'PostgreSQL', 'Docker', 'Vite', 'GraphQL',
            'React', 'TypeScript', 'Node.js', 'Tailwind CSS', 'PostgreSQL', 'Docker', 'Vite', 'GraphQL'].map((tech, i) => (
            <span key={i} className="text-lg font-medium text-gray-400 dark:text-gray-500">
              {tech} <span className="mx-4 text-indigo-400">✦</span>
            </span>
          ))}
        </motion.div>
      </section>

      {/* Recent Posts */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-2">Recent Posts</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-10">Thoughts, tutorials, and more.</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentBlogs.map((blog, i) => (
              <motion.div
                key={blog.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link
                  to={`/blog/${blog.slug}`}
                  className="block p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all hover:shadow-lg hover:-translate-y-1 h-full"
                >
                  <div className="flex flex-wrap gap-2 mb-3">
                    {blog.frontmatter.tags?.slice(0, 2).map(tag => (
                      <span key={tag} className="text-xs px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white line-clamp-2">
                    {blog.frontmatter.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3">
                    {blog.frontmatter.excerpt}
                  </p>
                  <div className="mt-4 text-xs text-gray-400 dark:text-gray-500">
                    {blog.frontmatter.date && new Date(blog.frontmatter.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-10 text-center"
          >
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
            >
              View all posts →
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
