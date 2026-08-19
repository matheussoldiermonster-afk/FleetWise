import axios from "axios";

// Em produção, defina VITE_API_URL no .env do frontend com a URL real
// do backend publicado (ex: https://api.suaempresa.com/api).
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
});

export default api;