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

export let globalLogout: (() => void) | null = null;

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = Boolean(user);

  const fetchUserData = async () => {
    try {
      const { data } = await serverAPI.get<{ user: User }>("/user/get-user", {
        withCredentials: true,
      });

      if (!data?.user) {
        console.warn(
          "User data is null. The user is either not logged in or session expired."
        );
      }

      setUser(data?.user || null);
      return { success: !!data?.user, user: data?.user || null };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      console.warn(
        "Error fetching user data: User not logged in or session expired."
      );
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
      if (!data?.verify) {
        setUser(null);
        console.warn("User not logged in or session expired.");
        return { success: false };
      }

      return await fetchUserData();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      console.warn("Token verification failed, user not logged in.");
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      console.warn("Logout failed, but proceeding with logout.");
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
