import axios from "axios";

const api = axios.create({
  baseURL: "https://overfeminine-armandina-snowless.ngrok-free.dev/api",
  headers: {
    'ngrok-skip-browser-warning': 'true'
  }
});

api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;