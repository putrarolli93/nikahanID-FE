import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const API_BASE_URL = `http://${window.location.hostname}:5000/api`;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  // Verify token on mount or token changes
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const result = await response.json();

        if (response.ok && result.success) {
          setUser(result.data);
        } else {
          // Token is invalid/expired
          logout();
        }
      } catch (error) {
        console.error("Token verification failed:", error);
        // We might be offline, keep the offline user state but don't clear unless it's a 401
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        return {
          success: false,
          message: result.message || "Email atau password salah",
          errors: result.errors || null,
        };
      }

      const { user: loggedInUser, token: authToken } = result.data;
      localStorage.setItem("token", authToken);
      setToken(authToken);
      setUser(loggedInUser);

      return {
        success: true,
        message: result.message || "Login berhasil",
      };
    } catch (error) {
      console.error("Login request error:", error);
      return {
        success: false,
        message: "Koneksi internet bermasalah. Silakan coba lagi.",
      };
    }
  };

  const register = async (name, email, password, phone) => {
    try {
      const payload = { name, email, password };
      if (phone) payload.phone = phone;

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        return {
          success: false,
          message: result.message || "Pendaftaran gagal",
          errors: result.errors || null,
        };
      }

      const { user: registeredUser, token: authToken } = result.data;
      localStorage.setItem("token", authToken);
      setToken(authToken);
      setUser(registeredUser);

      return {
        success: true,
        message: result.message || "Registrasi berhasil",
      };
    } catch (error) {
      console.error("Registration request error:", error);
      return {
        success: false,
        message: "Koneksi internet bermasalah. Silakan coba lagi.",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
