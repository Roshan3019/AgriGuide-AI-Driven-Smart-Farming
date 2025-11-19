import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-6">Welcome to AgriGuide</h2>
        <p className="text-gray-700 mb-4">Your smart farming assistant.</p>
        <Link to="/soil" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Analyze Soil
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;