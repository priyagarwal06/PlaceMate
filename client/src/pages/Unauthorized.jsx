import { Link } from 'react-router-dom';

const Unauthorized = () => (
  <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center text-center px-4">
    <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
    <p className="text-gray-600 mb-6">You don't have permission to view this page.</p>
    <Link to="/" className="text-indigo-700 hover:underline">
      Go back home
    </Link>
  </div>
);

export default Unauthorized;
