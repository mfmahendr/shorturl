import { useContext } from "react";
import { Auth } from "../context/Auth";

const useAuth = () => {
  const context = useContext(Auth);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default useAuth;
