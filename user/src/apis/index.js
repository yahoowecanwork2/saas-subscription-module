import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  timeout: 10000,
  withCredentials: true, // cookies will still be sent
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    // Attach token from localStorage
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor
api.interceptors.response.use(
  (res) => res,
  (error) => {
    console.error("API Error:", error);

    if (error.response?.status === 401) {
      // token invalid, expired, or not sent
      // handle logout if you want
      // window.location.href='/auth'
    }

    return Promise.reject(error);
  },
);
