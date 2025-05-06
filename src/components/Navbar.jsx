import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-gray-800">
            Smart College Companion
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <Link to="/timetable" className="text-gray-600 hover:text-gray-900">
                Timetable
              </Link>
              <Link to="/assignments" className="text-gray-600 hover:text-gray-900">
                Assignments
              </Link>
              <Link to="/attendance" className="text-gray-600 hover:text-gray-900">
                Attendance
              </Link>
              <Link to="/notes" className="text-gray-600 hover:text-gray-900">
                Notes
              </Link>
              <Link to="/events" className="text-gray-600 hover:text-gray-900">
                Events
              </Link>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-600 hover:text-gray-900"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 