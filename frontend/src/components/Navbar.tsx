import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-green-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="text-xl font-bold">
              AgriGuide
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to="/dashboard"
              className="hover:bg-green-700 px-3 py-2 rounded-md text-sm font-medium"
            >
              Dashboard
            </Link>
            <Link
              to="/soil"
              className="hover:bg-green-700 px-3 py-2 rounded-md text-sm font-medium"
            >
              Soil Analysis
            </Link>
            <Link
              to="/crops"
              className="hover:bg-green-700 px-3 py-2 rounded-md text-sm font-medium opacity-60"
            >
              Crop Recommendations
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;