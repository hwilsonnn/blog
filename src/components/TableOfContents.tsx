import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

interface TOCItem {
  id: string
  text: string
  level: number
}

interface TableOfContentsProps {
  articleRef?: React.RefObject<HTMLElement>
}

export default function TableOfContents({ articleRef }: TableOfContentsProps) {
  const [items, setItems] = useState<TOCItem[]>([])
  const [activeId, setActiveId] = useState<string>("")
  const tocRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Scan the article element for headings after a short delay to ensure rendering is complete
    const timer = setTimeout(() => {
      const target = articleRef?.current || document.querySelector("article")
      if (!target) return

      const headings = target.querySelectorAll("h1, h2, h3, h4")
      const tocItems: TOCItem[] = []

      headings.forEach((heading) => {
        const text = heading.textContent || ""
        if (!text) return

        const id = text.replaceAll(/[^a-z0-9]/gi, "").toLowerCase()
        heading.id = id

        tocItems.push({
          id,
          text,
          level: parseInt(heading.tagName[1]),
        })
      })

      setItems(tocItems)
    }, 100)

    return () => clearTimeout(timer)
  }, [articleRef])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: "-64px 0px -66% 0px" },
    )

    const headings = document.querySelectorAll(
      "article h1, article h2, article h3, article h4",
    )
    headings.forEach((heading) => {
      const text = heading.textContent || ""
      const id = text.replaceAll(/[^a-z0-9]/gi, "").toLowerCase()
      heading.id = id
      observer.observe(heading)
    })

    return () => observer.disconnect()
  }, [items])

  const handleClick = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offsetTop =
        element.getBoundingClientRect().top + window.scrollY - 80
      window.scrollTo({ top: offsetTop, behavior: "smooth" })
    }
  }

  if (items.length === 0) return null

  return (
    <motion.div
      ref={tocRef}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="h-full"
    >
      <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
          On this page
        </h3>
        <nav className="space-y-2">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => handleClick(item.id)}
              className={`block w-full text-left text-sm transition-colors ${
                activeId === item.id
                  ? "text-indigo-600 dark:text-indigo-400 font-medium"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
              style={{ paddingLeft: `${(item.level - 1) * 0.75}rem` }}
            >
              {item.text}
            </button>
          ))}
        </nav>
      </div>
    </motion.div>
  )
}
