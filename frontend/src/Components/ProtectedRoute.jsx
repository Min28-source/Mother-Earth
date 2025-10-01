import { Navigate} from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "../Contexts/toastContext";

export default function ProtectedRoute({children}) {
  const {showWarning} = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const check = localStorage.getItem("token");
    if (check) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  if (isAuthenticated === null) return null;

  if (!isAuthenticated) {
    showWarning("You must be logged in first!")
    return <Navigate to="/login"/>;
  }
  return children;
}
