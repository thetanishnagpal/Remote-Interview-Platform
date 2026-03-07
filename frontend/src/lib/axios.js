import axios from "axios";
console.log("API:", import.meta.env.VITE_API_URL);

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, //brwoser will send cookies with requests to the server automatically 
  // on every single request 
});

export default axiosInstance;