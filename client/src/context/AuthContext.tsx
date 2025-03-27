import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";
import type { User, AuthContextType } from "../types/Types";
import LoadingPage from "../components/LoadingPage/LoadingPage";
import serverAPI from "../helper/axios";
import SERVER_URL from "../helper/envVariables";

export let globalLogout: (() => void) | null = null;

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = !!user;

  const fetchUserData = async () => {
    try {
      const { data } = await serverAPI.get<{ user: User }>("/user/get-user", {
        withCredentials: true,
      });
      if (data.user.profileImage) {
        data.user.profileImage = SERVER_URL + data.user.profileImage;
      }
      setUser(data.user);
      return { success: true, user: data.user };
    } catch (error) {
      console.error("Failed to fetch user data", error);
      setUser(null);
      return { success: false };
    }
  };

  const verifyToken = async () => {
    try {
      const { data } = await serverAPI.post(
        "/api/verify-token",
        {},
        { withCredentials: true }
      );

      if (!data.verify) {
        setUser(null);
        return { success: false };
      }

      return await fetchUserData();

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      console.error("Failed to verify token");
      setUser(null);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  const login = async (rememberMe: boolean) => {
    const { success } = await verifyToken();

    if (success && rememberMe) {
      localStorage.setItem("rememberMe", "true");
    } else {
      localStorage.removeItem("rememberMe");
    }

    return success;
  };

  const logout = async () => {
    try {
      await serverAPI.post("/api/logout", {}, { withCredentials: true });
      setUser(null);
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      localStorage.removeItem("rememberMe");
    }
  };

  useEffect(() => {
    verifyToken();

    const interval = setInterval(() => {
      verifyToken();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  if (loading) return <LoadingPage fadeOut={false} />;

  globalLogout = logout;

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loading, verifyToken, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
