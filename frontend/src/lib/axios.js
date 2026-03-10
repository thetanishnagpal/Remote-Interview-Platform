import axios from "axios";

const rawBaseURL = import.meta.env.VITE_API_URL || "";

// Force the baseURL to end with /api/
const baseURL = rawBaseURL.endsWith("/") 
  ? rawBaseURL 
  : `${rawBaseURL}/`;

const axiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

// ADD THIS INTERCEPTOR - This will force-fix the URL before it leaves
axiosInstance.interceptors.request.use((config) => {
  // If the URL starts with a slash, remove it to make it relative to baseURL
  if (config.url.startsWith("/")) {
    config.url = config.url.substring(1);
  }
  console.log("🚀 FINAL OUTGOING URL:", config.baseURL + config.url);
  return config;
});

export default axiosInstance;