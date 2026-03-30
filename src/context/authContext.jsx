import { createContext, useContext, useEffect, useState } from "react";
import api from "../utils/api";
import Loader from "../components/Loader";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await api("get", "user/me/");
      setUser(res.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api("post", "user/logout/"); 
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null); 
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) return <Loader />;

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        logout,
        fetchUser, 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);