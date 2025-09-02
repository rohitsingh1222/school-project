import axios from "axios";

const API = axios.create({
  baseURL:
    (process.env.REACT_APP_BACKEND_URL
      ? process.env.REACT_APP_BACKEND_URL + "/api"
      : "http://localhost:5000/api"), // fallback for dev
  withCredentials: false,
});

export default API;

