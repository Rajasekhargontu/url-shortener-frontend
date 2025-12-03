import { createContext, useContext, useState } from "react";
const AuthContext = createContext(null);
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}
export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => {
    return localStorage.getItem("auth_token") || null;
  });
  const setToken = (value) => {
    if (value) {
      localStorage.setItem("auth_token", value);
    } else {
      localStorage.removeItem("auth_token");
    }
    setTokenState(value);
  };
  const value = {
    token,
    setToken,
    isAuthenticated: Boolean(token),
  };
  //console.log(value)
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
