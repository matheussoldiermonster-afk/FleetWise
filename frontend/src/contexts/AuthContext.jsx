import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("@fleetwise_token");
    const savedUser = localStorage.getItem("@fleetwise_user");

    if (token && savedUser) {
      api.defaults.headers.Authorization = `Bearer ${token}`;
      setUser(JSON.parse(savedUser));
    }

    setLoading(false);
  }, []);

  async function login(email, password) {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    const { token, user } = response.data;

    localStorage.setItem("@fleetwise_token", token);
    localStorage.setItem("@fleetwise_user", JSON.stringify(user));

    api.defaults.headers.Authorization = `Bearer ${token}`;

    setUser(user);
  }

  function logout() {
    localStorage.removeItem("@fleetwise_token");
    localStorage.removeItem("@fleetwise_user");

    delete api.defaults.headers.Authorization;

    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        authenticated: !!user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}