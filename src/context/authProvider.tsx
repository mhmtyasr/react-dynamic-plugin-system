import { createContext, useState, useContext } from "react";

export interface AuthContextType {
  userName: string;
  setUserName: (userName: string) => void;
}

let AuthContext = createContext<AuthContextType>(null!);

function AuthProvider({ children }: { children: React.ReactNode }) {
  let [userName, setUserName] = useState<string>("Yasir Aktunç");

  let value = { userName, setUserName };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

const useAuth = (): AuthContextType => {
  return useContext(AuthContext);
};

export { useAuth, AuthProvider };
