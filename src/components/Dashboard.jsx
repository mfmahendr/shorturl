import { useState, useEffect } from "react";
import { urlShortenerAPI } from "../services/shurlApi";
import { Link, Copy, RefreshCw, BarChart3, Lock } from "lucide-react";
import ShortlinkForm from "./ShortlinkForm";

export default function Dashboard() {
  const [shortLinks, setShortLinks] = useState([]);
  const [loadingLinks, setLoadingLinks] = useState(false);

  const fetchShortLinks = async () => {
    setLoadingLinks(true);
    try {
      const response = await urlShortenerAPI.getShortlinks();
      setShortLinks(response.data);
    } catch (err) {
      console.error("Error fetching shortlinks:", err);
    }
    setLoadingLinks(false);
  };

  useEffect(() => {
    fetchShortLinks();
  }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const handleCreateSuccess = () => {
    fetchShortLinks();
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Shortlink Form - Always Visible */}
      <ShortlinkForm onSuccess={handleCreateSuccess} />

      {/* My Shortlinks Section */}
      <div className="bg-white shadow-lg rounded-xl p-6 border border-lime-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Link className="w-5 h-5 text-lime-600" />
            My Shortlinks
          </h2>
          <button
            onClick={fetchShortLinks}
            disabled={loadingLinks}
            className="bg-lime-100 hover:bg-lime-200 text-lime-800 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 disabled:opacity-50 flex items-center gap-2"
          >
            {loadingLinks ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            {loadingLinks ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {loadingLinks ? (
          <div className="flex justify-center py-8">
            <RefreshCw className="w-8 h-8 animate-spin text-lime-500" />
          </div>
        ) : shortLinks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No shortlinks created yet.</p>
            <p className="text-sm mt-1">Create your first short URL above!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {shortLinks.map((link) => (
              <div
                key={link.short_id}
                className="border border-lime-200 rounded-lg p-4 hover:bg-lime-50 transition-colors duration-200"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-900">
                        {link.short_id}
                      </span>
                      {link.is_private && (
                        <span className="bg-lime-100 text-lime-800 text-xs px-2 py-1 rounded flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          Private
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {link.url}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() =>
                        copyToClipboard(
                          `${window.location.origin}/r/${link.short_id}`,
                        )
                      }
                      className="bg-lime-100 hover:bg-lime-200 text-lime-800 px-3 py-1 rounded text-sm transition-colors duration-200 flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      Copy
                    </button>
                    <a
                      href={`/analytics?short_id=${link.short_id}`}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm transition-colors duration-200 flex items-center gap-1"
                    >
                      <BarChart3 className="w-3 h-3" />
                      Analytics
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>
                    Created: {new Date(link.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
