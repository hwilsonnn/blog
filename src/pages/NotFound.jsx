import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-8xl font-bold text-gray-200 dark:text-gray-700 mb-4">404</div>
        <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Page Not Found</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Looks like this page doesn't exist yet.
        </p>
        <Link
          to="/"
          className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors"
        >
          Go Home
        </Link>
      </motion.div>
    </div>
  );
}
