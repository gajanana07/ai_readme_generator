import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.REACT_APP_API_URL || "http://localhost:8000/api", // Your backend API URL
  withCredentials: true, // tells axios to send cookies
});

export default apiClient;
