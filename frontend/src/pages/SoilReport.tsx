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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Soil Analysis</h2>

        {/* Mode Selection */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setMode('location')}
            className={`flex-1 py-2 px-4 rounded ${mode === 'location' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Use my location
          </button>
          <button
            onClick={() => setMode('manual')}
            className={`flex-1 py-2 px-4 rounded ${mode === 'manual' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Enter manually
          </button>
        </div>

        {mode === 'location' && (
          <div className="space-y-4">
            <p className="text-gray-600 text-sm">
              We will use your GPS location to estimate soil fertility using govt-style data.
            </p>
            <button
              onClick={handleLocationSubmit}
              disabled={loading}
              className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 disabled:opacity-50"
            >
              {loading ? 'Getting location...' : 'Get Soil Analysis'}
            </button>
          </div>
        )}

        {mode === 'manual' && (
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700">pH</label>
                <input
                  type="number"
                  step="0.1"
                  name="pH"
                  value={formData.pH}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Nitrogen</label>
                <input
                  type="number"
                  step="0.1"
                  name="nitrogen"
                  value={formData.nitrogen}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Phosphorus</label>
                <input
                  type="number"
                  step="0.1"
                  name="phosphorus"
                  value={formData.phosphorus}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Potassium</label>
                <input
                  type="number"
                  step="0.1"
                  name="potassium"
                  value={formData.potassium}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Organic Carbon (%)</label>
                <input
                  type="number"
                  step="0.1"
                  name="organicCarbon"
                  value={formData.organicCarbon}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Moisture (%)</label>
                <input
                  type="number"
                  step="0.1"
                  name="moisture"
                  value={formData.moisture}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 disabled:opacity-50"
            >
              {loading ? 'Analyzing...' : 'Analyze Soil'}
            </button>
          </form>
        )}

        {error && <p className="mt-4 text-red-500">{error}</p>}
        {result && (
          <div className="mt-6 p-4 bg-gray-50 rounded">
            <h3 className="text-lg font-semibold">Analysis Result</h3>
            <p><strong>Fertility Category:</strong> {result.fertilityCategory}</p>
            <p><strong>Recommendations:</strong> {result.recommendations}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SoilReport;
