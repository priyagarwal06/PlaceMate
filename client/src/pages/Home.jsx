import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <h1 className="text-4xl font-bold text-indigo-700 mb-4">Welcome to PlaceMate</h1>
      <p className="text-gray-600 max-w-md mb-8">
        The smart placement portal connecting students and recruiters — find opportunities,
        post jobs, and track applications, all in one place.
      </p>
      <div className="flex gap-4">
        <Link to="/register" className="bg-indigo-700 text-white px-6 py-2 rounded hover:bg-indigo-800">
          Get Started
        </Link>
        <Link to="/login" className="border border-indigo-700 text-indigo-700 px-6 py-2 rounded hover:bg-indigo-50">
          Login
        </Link>
      </div>
    </div>
  );
};

export default Home;
