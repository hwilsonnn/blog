import { motion, type Variants } from "framer-motion"
import { Link } from "react-router-dom"

type Theme = "light" | "dark"

interface HomeProps {
  theme: Theme
  toggleTheme: () => void
}

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

export default function Home({ theme, toggleTheme }: HomeProps) {
  return (
    <div className="relative min-h-screen px-4 flex items-center justify-center overflow-hidden">
      <motion.button
        type="button"
        onClick={toggleTheme}
        key={theme}
        initial={{ opacity: 0, scale: 0.72 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="absolute -top-56 -left-44 sm:-top-64 sm:-left-52 select-none z-20 focus:outline-none"
        aria-label="Toggle theme"
      >
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ duration: 32, ease: "linear", repeat: Infinity }}
          className="block text-[26rem] sm:text-[32rem] leading-none"
        >
          {theme === "dark" ? "🌑" : "☀️"}
        </motion.span>
      </motion.button>

      <motion.section
        variants={container}
        initial="hidden"
        animate="show"
        className="w-full max-w-md text-center relative z-10"
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
