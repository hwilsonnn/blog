import {
  HashRouter as Router,
  Routes,
  Route,
  useLocation
} from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Blog from "./pages/Blog"
import BlogPost from "./pages/BlogPost"
import Projects from "./pages/Projects"
import ProjectPost from "./pages/ProjectPost"
import About from "./pages/About"
import NotFound from "./pages/NotFound"
import { useTheme } from "./hooks/useTheme"
import BackToTopButton from "./components/BackToTopButton"

interface AppLayoutProps {
  theme: string
  toggleTheme: () => void
}

function AppLayout({ theme, toggleTheme }: AppLayoutProps) {
  const location = useLocation()
  const showNavbar = location.pathname !== "/"
  const isBlogRoute =
    location.pathname === "/blog" ||
    location.pathname.startsWith("/blog/") ||
    location.pathname === "/about"

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {showNavbar && <Navbar theme={theme} toggleTheme={toggleTheme} />}
      <main>
        <Routes>
          <Route
            path="/"
            element={<Home theme={theme} toggleTheme={toggleTheme} />}
          />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectPost />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <BackToTopButton enabled={isBlogRoute} />
    </div>
  )
}

function App() {
  const { theme, toggleTheme } = useTheme()

  return (
    <Router>
      <AppLayout theme={theme} toggleTheme={toggleTheme} />
    </Router>
  )
}

export default App
