import { motion, type Variants } from "framer-motion"
import { Link } from "react-router-dom"
import { useMemo } from "react"

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
  const cricketMotion = useMemo(() => {
    const xFrames: Array<string> = []
    const yFrames: Array<number> = []
    const rotateFrames: Array<number> = []
    const scaleXFrames: Array<number> = []
    const times: Array<number> = []

    let x = 4
    let t = 0
    let previousX = x
    let facing: 1 | -1 = -1

    const pushFrame = (y: number, rotation: number) => {
      const clampedX = Math.max(2, Math.min(86, x))

      if (clampedX > previousX) {
        facing = -1
      } else if (clampedX < previousX) {
        facing = 1
      }

      xFrames.push(`${clampedX.toFixed(1)}vw`)
      yFrames.push(y)
      rotateFrames.push(rotation)
      scaleXFrames.push(facing)
      times.push(t)
      previousX = clampedX
    }

    pushFrame(0, 0)

    for (let i = 0; i < 10; i += 1) {
      if (i > 0 && Math.random() < 0.35) {
        const longPause = 1.8 + Math.random() * 2.2
        t += longPause
        pushFrame(0, (Math.random() - 0.5) * 2)
      }

      const pause = 0.45 + Math.random() * 0.85
      t += pause
      pushFrame(0, (Math.random() - 0.5) * 6)

      const jumpDuration = 0.09 + Math.random() * 0.12
      const forward = 4 + Math.random() * 6.5
      const backstep = Math.random() < 0.4 ? -(0.8 + Math.random() * 1.8) : 0
      const apex = -(7 + Math.random() * 8)

      t += jumpDuration * 0.45
      x += forward
      pushFrame(apex, (Math.random() > 0.5 ? 1 : -1) * (7 + Math.random() * 6))

      t += jumpDuration * 0.55
      x += backstep
      pushFrame(0, (Math.random() > 0.5 ? 1 : -1) * (3 + Math.random() * 7))
    }

    t += 0.22
    pushFrame(0, 0)

    return {
      x: xFrames,
      y: yFrames,
      rotate: rotateFrames,
      scaleX: scaleXFrames,
      times: times.map((value) => value / t),
      duration: Math.max(14, t * 1.05),
    }
  }, [theme])

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

      {theme === "dark" && (
        <motion.div
          key="cricket"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="pointer-events-none absolute bottom-8 left-0 right-0 z-10"
          aria-hidden="true"
        >
          <motion.span
            className="absolute text-3xl leading-none"
            animate={{
              x: cricketMotion.x,
              y: cricketMotion.y,
              rotate: cricketMotion.rotate,
              scaleX: cricketMotion.scaleX,
            }}
            transition={{
              duration: cricketMotion.duration,
              ease: "linear",
              times: cricketMotion.times,
              repeat: Infinity,
              repeatType: "mirror",
            }}
            style={{ transformOrigin: "center" }}
          >
            🦗
          </motion.span>
        </motion.div>
      )}

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
