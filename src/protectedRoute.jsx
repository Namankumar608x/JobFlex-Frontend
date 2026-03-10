import { Navigate } from "react-router-dom";
import { useAuth } from "./context/authContext";
import Loader from "./components/Loader";
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
 
  if (loading) return <Loader />;

  if (!user) return(
   
    <>
    
     <Navigate onNavigate={()=>alert("Kindly Login first!")} to="/login" />
     </>
    );

  return children;
}