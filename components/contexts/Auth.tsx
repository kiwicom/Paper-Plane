import {
  createContext,
  ReactElement,
  useContext,
  useEffect,
  useState,
} from "react";
import { getAuth, onAuthStateChanged, User } from "@firebase/auth";

export type AuthContextType = User | null;

export const AuthContext = createContext<AuthContextType>(null);

export const useAuth = (): AuthContextType => useContext(AuthContext);

export type AuthProviderProps = {
  children: ReactElement;
};

export const AuthProvider = ({ children }: AuthProviderProps): ReactElement => {
  const [auth, setAuth] = useState<AuthContextType>(null);

  useEffect(() => {
    const firebaseAuth = getAuth();
    setAuth(firebaseAuth.currentUser);
    onAuthStateChanged(firebaseAuth, (user) => {
      if (user) {
        setAuth(user);
      } else {
        setAuth(null);
      }
    });
  }, []);

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};
