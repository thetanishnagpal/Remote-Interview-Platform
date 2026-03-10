import axios from "axios";

const rawBaseURL = import.meta.env.VITE_API_URL;
console.log("Raw API URL from Env:", rawBaseURL);

// This ensures that even if you forgot the slash in Render settings, 
// the code adds it so 'sessions' becomes '/api/sessions' and not '/apisessions'
const baseURL = rawBaseURL ? (rawBaseURL.endsWith("/") ? rawBaseURL : `${rawBaseURL}/`) : "";

const axiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

// Extra safety: Log the final baseURL being used by axios
console.log("Axios Final BaseURL:", axiosInstance.defaults.baseURL);

export default axiosInstance;