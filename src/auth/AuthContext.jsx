import { createContext, useContext } from "react";

export const AuthContext = createContext(null);

// Custom hook
export const useAuth = () => useContext(AuthContext);
