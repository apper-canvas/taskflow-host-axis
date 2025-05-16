import { Link } from 'react-router-dom'
import { getIcon } from '../utils/iconUtils'

const AlertTriangleIcon = getIcon('AlertTriangle')
const ArrowLeftIcon = getIcon('ArrowLeft')

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="card max-w-md w-full text-center">
        <div className="bg-surface-100 dark:bg-surface-800 rounded-full p-4 w-20 h-20 flex items-center justify-center mx-auto mb-6">
          <AlertTriangleIcon className="w-10 h-10 text-secondary" />
        </div>
        
        <h1 className="text-3xl font-bold mb-2">Page Not Found</h1>
        
        <p className="text-surface-600 dark:text-surface-400 mb-8">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        
        <Link 
          to="/" 
          className="btn-primary inline-flex items-center justify-center gap-2"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  )
}

export default NotFound