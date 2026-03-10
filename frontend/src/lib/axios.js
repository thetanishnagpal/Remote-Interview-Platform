import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL.endsWith("/")
    ? import.meta.env.VITE_API_URL
    : `${import.meta.env.VITE_API_URL}/`,
  withCredentials: true,
});

// This function will be called once in App.jsx
export const setupAxiosInterceptors = (getToken) => {
  axiosInstance.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, (error) => Promise.reject(error));
};

export default axiosInstance;