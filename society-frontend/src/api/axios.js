import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api"
});

api.interceptors.request.use(config => {

  const authStorage =
    sessionStorage.getItem("auth-storage");

  const token = authStorage
    ? JSON.parse(authStorage).state.token
    : null;

  if (token) {

    config.headers.Authorization =
      `Bearer ${token}`;

  }

  return config;
});

export default api;