interface BackToTopButtonProps {
  enabled?: boolean
}

export default function BackToTopButton({
  enabled = true,
}: BackToTopButtonProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (!enabled) return null

  return (
    <div className="back-to-top fixed bottom-6 right-6 z-40">
      <div className="button-container">
        <button
          type="button"
          onClick={scrollToTop}
          className="rounded-full border border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-lg backdrop-blur hover:bg-white dark:hover:bg-gray-800 transition-colors"
          aria-label="Back to top"
        >
          ↑ Top
        </button>
      </div>
    </div>
  )
}
