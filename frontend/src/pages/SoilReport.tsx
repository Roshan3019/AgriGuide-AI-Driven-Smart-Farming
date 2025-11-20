import { useState } from "react";
import axios from "axios";

interface SoilReportResponse {
  id: number;
  fieldId: number;
  pH: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  organicCarbon: number;
  moisture: number;
  fertilityCategory: string;
  recommendations: string;
  temperature: number | null;
  humidity: number | null;
  windSpeed: number | null;
  rainfall: number | null;
  soilMoisture: number | null;
  soilTemperature: number | null;
  createdAt: string;
}

const SoilReport = () => {
  const [mode, setMode] = useState<"location" | "manual">("location");
  const [formData, setFormData] = useState({
    pH: "",
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    organicCarbon: "",
    moisture: "",
  });
  const [result, setResult] = useState<SoilReportResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLocationSubmit = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please login first");
      setLoading(false);
      return;
    }

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const response = await axios.post(
            "http://localhost:3000/soil-reports/by-location",
            {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setResult(response.data);
        } catch (err: any) {
          setError(err.response?.data?.message || "An error occurred");
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        setError("Unable to get your location: " + error.message);
        setLoading(false);
      }
    );
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please login first");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/soil-reports",
        {
          pH: parseFloat(formData.pH),
          nitrogen: parseFloat(formData.nitrogen),
          phosphorus: parseFloat(formData.phosphorus),
          potassium: parseFloat(formData.potassium),
          organicCarbon: parseFloat(formData.organicCarbon),
          moisture: parseFloat(formData.moisture),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getFertilityColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'very high':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'high':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'average':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'very low':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Soil Analysis</h1>
        <p className="mt-2 text-sm text-gray-600">Get detailed soil fertility insights for better farming decisions</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setMode('location')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              mode === 'location'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Use My Location
          </button>
          <button
            onClick={() => setMode('manual')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              mode === 'manual'
                ? 'border-green-500 text-green-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Manual Entry
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-8">
          {mode === 'location' && (
            <div className="text-center space-y-6">
              <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Location-Based Analysis</h3>
                <p className="mt-2 text-sm text-gray-600">
                  We will use your GPS location to estimate soil fertility using govt-style data.
                </p>
              </div>
              <button
                onClick={handleLocationSubmit}
                disabled={loading}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                {loading ? 'Getting location...' : 'Get Soil Analysis'}
              </button>
            </div>
          )}

          {mode === 'manual' && (
            <form onSubmit={handleManualSubmit} className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Manual Soil Parameters</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="pH" className="block text-sm font-medium text-gray-700">pH Level</label>
                    <input
                      id="pH"
                      name="pH"
                      type="number"
                      step="0.1"
                      value={formData.pH}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="nitrogen" className="block text-sm font-medium text-gray-700">Nitrogen (%)</label>
                    <input
                      id="nitrogen"
                      name="nitrogen"
                      type="number"
                      step="0.1"
                      value={formData.nitrogen}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="phosphorus" className="block text-sm font-medium text-gray-700">Phosphorus (%)</label>
                    <input
                      id="phosphorus"
                      name="phosphorus"
                      type="number"
                      step="0.1"
                      value={formData.phosphorus}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="potassium" className="block text-sm font-medium text-gray-700">Potassium (%)</label>
                    <input
                      id="potassium"
                      name="potassium"
                      type="number"
                      step="0.1"
                      value={formData.potassium}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="organicCarbon" className="block text-sm font-medium text-gray-700">Organic Carbon (%)</label>
                    <input
                      id="organicCarbon"
                      name="organicCarbon"
                      type="number"
                      step="0.1"
                      value={formData.organicCarbon}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="moisture" className="block text-sm font-medium text-gray-700">Moisture (%)</label>
                    <input
                      id="moisture"
                      name="moisture"
                      type="number"
                      step="0.1"
                      value={formData.moisture}
                      onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  {loading ? 'Analyzing...' : 'Analyze Soil'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mt-6 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Results Display */}
      {result && (
        <div className="mt-6 bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Analysis Result</h3>
          </div>
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Fertility Category</h4>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getFertilityColor(result.fertilityCategory)}`}>
                  {result.fertilityCategory}
                </span>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Analysis Date</h4>
                <p className="text-sm text-gray-900">{new Date(result.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">Recommendations</h4>
              <div className="bg-gray-50 rounded-md p-4">
                <p className="text-sm text-gray-700 whitespace-pre-line">{result.recommendations}</p>
              </div>
            </div>

            {/* Weather & Climate Data */}
            {(result.temperature !== null || result.humidity !== null || result.windSpeed !== null ||
              result.rainfall !== null || result.soilMoisture !== null || result.soilTemperature !== null) && (
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">Weather & Climate Data</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.temperature !== null && (
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-md">
                      <span className="text-sm font-medium text-blue-700">Temperature</span>
                      <span className="text-sm text-blue-600">{result.temperature}°C</span>
                    </div>
                  )}
                  {result.humidity !== null && (
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-md">
                      <span className="text-sm font-medium text-blue-700">Humidity</span>
                      <span className="text-sm text-blue-600">{result.humidity}%</span>
                    </div>
                  )}
                  {result.windSpeed !== null && (
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-md">
                      <span className="text-sm font-medium text-green-700">Wind Speed</span>
                      <span className="text-sm text-green-600">{result.windSpeed} m/s</span>
                    </div>
                  )}
                  {result.rainfall !== null && (
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-md">
                      <span className="text-sm font-medium text-green-700">Rainfall</span>
                      <span className="text-sm text-green-600">{result.rainfall} mm</span>
                    </div>
                  )}
                  {result.soilMoisture !== null && (
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-md">
                      <span className="text-sm font-medium text-yellow-700">Soil Moisture</span>
                      <span className="text-sm text-yellow-600">{result.soilMoisture}</span>
                    </div>
                  )}
                  {result.soilTemperature !== null && (
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-md">
                      <span className="text-sm font-medium text-yellow-700">Soil Temperature</span>
                      <span className="text-sm text-yellow-600">{result.soilTemperature}°C</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SoilReport;
