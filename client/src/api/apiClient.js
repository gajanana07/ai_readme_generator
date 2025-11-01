import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:8000/api", // Your backend API URL
  withCredentials: true, // tells axios to send cookies
});

export default apiClient;
