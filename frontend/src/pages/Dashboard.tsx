import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface Field {
  id: number;
  name: string;
  location: string;
  size: number;
  latitude?: number | null;
  longitude?: number | null;
  baselinePh?: number | null;
  baselineOrganicCarbon?: number | null;
  baselineClayPercent?: number | null;
  baselineSandPercent?: number | null;
}

const Dashboard = () => {
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFields = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:3000/fields', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const fieldsData = await response.json();
          setFields(fieldsData);
        } else {
          setError('Failed to load fields');
        }
      } catch (err) {
        setError('Network error while loading fields');
      } finally {
        setLoading(false);
      }
    };

    fetchFields();
  }, [navigate]);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-600">Overview of your farm insights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">My Fields</dt>
                  <dd className="text-lg font-medium text-gray-900">{loading ? 'Loading...' : fields.length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Soil Reports</dt>
                  <dd className="text-lg font-medium text-gray-900">0 reports</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Crop Recommendations</dt>
                  <dd className="text-lg font-medium text-gray-900">Planned for next sprint</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fields & Baseline Soil Section */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">My Fields & Baseline Soil (SoilGrids)</h2>
          <p className="mt-1 text-sm text-gray-600">Soil baseline data from SoilGrids global database</p>
        </div>

        {loading && (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading your fields...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {!loading && !error && fields.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No fields found. Create your first field to see baseline soil data.</p>
          </div>
        )}

        {!loading && !error && fields.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fields.map((field) => (
              <div key={field.id} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">{field.name}</h3>
                      <p className="text-sm text-gray-500">
                        {field.location} · {field.size} acres
                      </p>
                      {field.latitude && field.longitude && (
                        <p className="text-xs text-gray-400 mt-1">
                          Lat: {field.latitude.toFixed(4)}, Lng: {field.longitude.toFixed(4)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Baseline Soil (from SoilGrids)</h4>

                    {(!field.baselinePh && !field.baselineOrganicCarbon && !field.baselineClayPercent && !field.baselineSandPercent) ? (
                      <p className="text-sm text-gray-500">Baseline soil data not available yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {field.baselinePh && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">pH:</span>
                            <span className="font-medium">{field.baselinePh.toFixed(1)}</span>
                          </div>
                        )}
                        {field.baselineOrganicCarbon && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Organic Carbon:</span>
                            <span className="font-medium">{field.baselineOrganicCarbon.toFixed(1)}%</span>
                          </div>
                        )}
                        {field.baselineClayPercent && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Clay:</span>
                            <span className="font-medium">{field.baselineClayPercent.toFixed(1)}%</span>
                          </div>
                        )}
                        {field.baselineSandPercent && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Sand:</span>
                            <span className="font-medium">{field.baselineSandPercent.toFixed(1)}%</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="text-center">
        <Link
          to="/soil"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Go to Soil Analysis
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;