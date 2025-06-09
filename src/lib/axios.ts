import axios from "axios";
import { getSession } from "next-auth/react";

const api = axios.create({
  baseURL: "https://estuda-facil-front-end.onrender.com",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true, // Importante para CORS com credenciais
});

api.interceptors.request.use(async (config) => {
  if (typeof window !== "undefined") {
    const session = await getSession();
    if (session?.user?.accessToken) {
      const token = session.user.accessToken.replace(/^Bearer /i, "");
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("Deu error")
    }
    return Promise.reject(error);
  }
);

export default api;
