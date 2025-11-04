import axios from "axios";
import { auth } from "../services/firebase";

const API_BASE_URL =
  import.meta.env.VITE_SHORTENER_API_URL || "http://localhost:8080";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptors for adding Firebase token
api.interceptors.request.use(async (config) => {
  // check if user is logged in
  if (auth.currentUser) {
    try {
      // retrieve fresh token from Firebase Auth
      const token = await auth.currentUser.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    } catch (error) {
      console.error("Error getting auth token:", error);
    }
  }
  return config;
});

// interceptor for token expiry handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // if error 401 (Unauthorized) and havent yer tried refreshing
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // force refresh token
        await auth.currentUser.getIdToken(true);
        const newToken = await auth.currentUser.getIdToken();
        
        // Update header with new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        
        // retry
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // Redirect ke login page if refresh fail
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export const urlShortenerAPI = {
  // authenticated endpoints
  shortenURL: (data) => api.post("/u/shorten", data),
  getShortlinks: () => api.get("/u/shortlinks"),
  getClickCount: (shortId) => api.get(`/u/click-count/${encodeURIComponent(shortId)}}`),
  exportClicks: (shortId, format = "csv", opts = {}) =>
    api.get(`/u/click-count/${encodeURIComponent(shortId)}/export`, {
      params: { format },
      ...opts,
    }),
  getAnalytics: (shortId, params = {}) =>
    api.get(`/u/analytics/${encodeURIComponent(shortId)}`, { params }),

  // admin endpoints
  getBlacklist: () => api.get("/admin/blacklist"),
  addBlacklist: (domain) => api.post("/admin/blacklist", { domain }),
  removeBlacklist: (type, value) =>
    api.delete(`/admin/blacklist?type=${type}&value=${value}`),
};

export default api;