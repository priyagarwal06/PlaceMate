import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center text-center px-4">
    <h1 className="text-6xl font-bold text-indigo-700 mb-4">404</h1>
    <p className="text-gray-600 mb-6">Page not found.</p>
    <Link to="/" className="text-indigo-700 hover:underline">
      Go back home
    </Link>
  </div>
);

export default NotFound;
