import { motion, type Variants } from "framer-motion"
import { Link } from "react-router-dom"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
} satisfies Variants

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
} satisfies Variants

export default function Home() {
  return (
    <div className="min-h-screen px-4 flex items-center justify-center">
      <motion.section
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full max-w-md text-center"
      >
        <motion.h1
          variants={item}
          className="text-3xl sm:text-4xl font-semibold text-gray-900 dark:text-white mb-3"
        >
          Welcome
        </motion.h1>
        <motion.p
          variants={item}
          className="text-gray-600 dark:text-gray-300 mb-8"
        >
          A simple place for notes, projects, and a little bit about me.
        </motion.p>

        <motion.div
          variants={item}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Link
            to="/blog"
            className="px-6 py-2.5 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium rounded-xl border border-gray-200 dark:border-gray-700 transition-colors"
          >
            Blog
          </Link>
          <Link
            to="/projects"
            className="px-6 py-2.5 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium rounded-xl border border-gray-200 dark:border-gray-700 transition-colors"
          >
            Projects
          </Link>
          <Link
            to="/about"
            className="px-6 py-2.5 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium rounded-xl border border-gray-200 dark:border-gray-700 transition-colors"
          >
            About
          </Link>
        </motion.div>
      </motion.section>
    </div>
  )
}
