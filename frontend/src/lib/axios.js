import axios from "axios";

console.log("API URL:", import.meta.env.VITE_API_URL);

const axiosInstance = axios.create({
  // This ensures there's always a slash between the base and the path
  baseURL: import.meta.env.VITE_API_URL.endsWith('/') 
    ? import.meta.env.VITE_API_URL 
    : `${import.meta.env.VITE_API_URL}/`,
  withCredentials: true,
});

export default axiosInstance;