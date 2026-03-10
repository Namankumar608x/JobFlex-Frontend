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
    } catch(error) {
      setUser(null);
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);
if(loading) return <Loader/>
  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);