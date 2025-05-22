import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types";
import { toast } from "sonner";
import api from "@/lib/axios";
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("estudaFacilUser");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("estudaFacilUser");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await api.post("/auth/login", {email, password});
      setUser(loggedInUser);
      localStorage.setItem("estudaFacilUser", JSON.stringify(response));
      toast.success("Login realizado com sucesso", {
        description: `Bem-vindo(a), ${loggedInUser.name}!`,
      });
    } catch (error) {
      toast.error("Falha no login",{
        description: "Email ou senha incorretos. Tente novamente.",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("estudaFacilUser");
    toast({
      title: "Logout realizado",
      description: "Você saiu do sistema.",
    });
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
