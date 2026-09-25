import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const dashboardPathForRole = (role) => {
  if (role === 'student') return '/student/dashboard';
  if (role === 'recruiter') return '/recruiter/dashboard';
  if (role === 'admin') return '/admin/dashboard';
  return '/';
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-indigo-700 text-white px-6 py-4 flex justify-between items-center shadow">
      <Link to={user ? dashboardPathForRole(user.role) : '/'} className="text-xl font-bold">
        PlaceMate
      </Link>
      <div className="flex items-center gap-4 text-sm">
        {user ? (
          <>
            <span>
              {user.name} <span className="opacity-75">({user.role})</span>
            </span>
            <button
              onClick={handleLogout}
              className="bg-indigo-900 px-3 py-1.5 rounded hover:bg-indigo-950 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-white text-indigo-700 px-3 py-1.5 rounded font-medium hover:bg-gray-100"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
