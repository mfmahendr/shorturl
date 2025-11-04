import { useState } from "react";
import { urlShortenerAPI } from "../services/shurlApi";
import { Link, Copy, RefreshCw, Lock, Globe } from "lucide-react";
import { useShortBaseUrl } from "../hooks/useShortBaseURL";

export default function ShortlinkForm({
  onSuccess,
  showTitle = true,
  compact = false,
}) {
  const [url, setUrl] = useState("");
  const [showCustomId, setShowCustomId] = useState(false);
  const [customId, setCustomId] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { getShortUrl } = useShortBaseUrl();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await urlShortenerAPI.shortenURL({
        url,
        custom_id: customId || undefined,
        is_private: isPrivate,
      });
      setResult(response.data);
      setUrl("");
      setCustomId("");
      setShowCustomId(false);
      setIsPrivate(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error("Error shortening: ", err);
      setError(err.response?.data || "Error shortening URL");
    }
    setLoading(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const resetForm = () => {
    setUrl("");
    setCustomId("");
    setShowCustomId(false);
    setIsPrivate(false);
    setResult(null);
    setError("");
  };

  return (
    <div
      className={`bg-white shadow-lg rounded-xl border border-lime-200 ${compact ? "p-4" : "p-6"}`}
    >
      {showTitle && (
        <div className="flex items-center gap-3 mb-6">
          <Link className="w-6 h-6 text-lime-600" />
          <h2 className="text-xl font-bold text-gray-900">Create Shortlink</h2>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className={`space-y-6 ${compact ? "space-y-4" : ""}`}
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Long URL
          </label>
          <input
            type="url"
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-colors duration-200"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-3 text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              className="h-4 w-4 text-lime-600 border-gray-300 rounded focus:ring-lime-500"
              checked={showCustomId}
              onChange={() => setShowCustomId(!showCustomId)}
            />
            Custom ID
          </label>

          {showCustomId && (
            <div className="transition-all duration-300">
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition-colors duration-200"
                placeholder="my-custom-id"
                value={customId}
                onChange={(e) => setCustomId(e.target.value)}
              />
            </div>
          )}
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isPrivate"
            className="h-4 w-4 text-lime-600 border-gray-300 rounded focus:ring-lime-500"
            checked={isPrivate}
            onChange={(e) => setIsPrivate(e.target.checked)}
          />
          <label
            htmlFor="isPrivate"
            className="ml-2 block text-sm text-gray-700 flex items-center gap-2"
          >
            <Lock className="w-4 h-4" />
            Make private (only accessible by you)
          </label>
        </div>

        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-lime-500 hover:bg-lime-600 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Link className="w-4 h-4" />
                Create Shortlink
              </>
            )}
          </button>
          {compact && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Reset
            </button>
          )}
        </div>
      </form>

      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-6 bg-lime-50 border border-lime-200 rounded-lg p-4">
          <p className="text-lime-800 font-medium flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Short URL created successfully!
          </p>
          <div className="mt-2 flex items-center gap-2">
            <code className="flex-1 bg-white border border-lime-300 rounded px-3 py-2 text-sm font-mono text-lime-800">
              {getShortUrl(result.short_id)}
            </code>
            <button
              onClick={() => copyToClipboard(getShortUrl(result.short_id))}
              className="bg-lime-100 hover:bg-lime-200 text-lime-800 px-3 py-2 rounded text-sm transition-colors duration-200 flex items-center gap-1"
            >
              <Copy className="w-3 h-3" />
              Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
