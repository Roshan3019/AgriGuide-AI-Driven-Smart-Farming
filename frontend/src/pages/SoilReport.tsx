import { useState } from 'react';
import axios from 'axios';

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
  const [formData, setFormData] = useState({
    fieldId: '',
    pH: '',
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    organicCarbon: '',
    moisture: '',
  });
  const [result, setResult] = useState<SoilReportResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please login first');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/soil-reports', {
        fieldId: parseInt(formData.fieldId),
        pH: parseFloat(formData.pH),
        nitrogen: parseFloat(formData.nitrogen),
        phosphorus: parseFloat(formData.phosphorus),
        potassium: parseFloat(formData.potassium),
        organicCarbon: parseFloat(formData.organicCarbon),
        moisture: parseFloat(formData.moisture),
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Soil Report Analysis</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Field ID</label>
            <input
              type="number"
              name="fieldId"
              value={formData.fieldId}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
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