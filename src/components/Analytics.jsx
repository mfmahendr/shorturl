import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { urlShortenerAPI } from "../services/shurlApi";
import {
  BarChart3,
  Download,
  Search,
  Calendar,
  Globe,
  User,
  Clock,
} from "lucide-react";

export default function Analytics() {
  const [shortId, setShortId] = useState("");
  const [analytics, setAnalytics] = useState(null);
  const [clickCount, setClickCount] = useState(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const idFromURL = params.get("short_id");

    if (idFromURL) {
      setShortId(idFromURL);
      // panggil langsung API
      (async () => {
        setLoading(true);
        try {
          const response = await urlShortenerAPI.getAnalytics(idFromURL);
          setAnalytics(response.data);
          setClickCount(response.data.total_clicks);
        } catch (error) {
          console.error("Error fetching analytics:", error);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [location.search]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await urlShortenerAPI.getAnalytics(shortId);
      setAnalytics(response.data);
      setClickCount(response.data.total_clicks);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
    setLoading(false);
  };

  const handleExport = async (format) => {
    try {
      const response = await urlShortenerAPI.exportClicks(shortId, format);
      const blob = new Blob([response.data], {
        type: format === "json" ? "application/json" : "text/csv",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `clicks-${shortId}.${format}`;
      a.click();
    } catch (error) {
      console.error("Export error:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-lg rounded-xl p-6 border border-lime-200">
        <div className="flex items-center gap-3 mb-8">
          <BarChart3 className="w-8 h-8 text-lime-600" />
          <h1 className="text-2xl font-bold text-gray-900">URL Analytics</h1>
        </div>
          <div className="flex space-x-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-colors duration-200"
              placeholder="Enter Short ID"
              value={shortId}
              onChange={(e) => setShortId(e.target.value)}
            />
          </div>
          <button
            onClick={fetchAnalytics}
            disabled={loading || !shortId}
            className="bg-lime-500 hover:bg-lime-600 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                Get Analytics
              </>
            )}
          </button>
        </div>
        {clickCount && (
          <div className="mb-8 p-6 bg-lime-50 border border-lime-200 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Click Count
            </h3>
            <p className="text-4xl font-bold text-lime-600">
              {clickCount} clicks
            </p>
          </div>
        )}

        {analytics && (
          <div className="transition-all duration-500">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Click Analytics
              </h3>
              <div className="space-x-3 flex flex-row">
                <button
                  onClick={() => handleExport("csv")}
                  className="bg-lime-500 hover:bg-lime-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
                <button
                  onClick={() => handleExport("json")}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export JSON
                </button>
              </div>
            </div>

 <div className="overflow-x-auto rounded-lg shadow border border-lime-200">
  <table className="min-w-full divide-y divide-lime-200">
    <thead className="bg-lime-50">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>Timestamp</span>
          </div>
        </th>
        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            <span>IP Address</span>
          </div>
        </th>
        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>User Agent</span>
          </div>
        </th>
      </tr>
    </thead>

    <tbody className="bg-white divide-y divide-lime-100">
      {analytics.clicks.map((click, index) => (
        <tr
          key={index}
          className="hover:bg-lime-50 transition-colors duration-200"
        >
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            {new Date(click.timestamp).toLocaleString()}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-mono">
            {click.ip}
          </td>
          <td className="px-6 py-4 text-sm text-gray-600">
            {click.user_agent}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

          </div>
        )}
      </div>
    </div>
  );
}
