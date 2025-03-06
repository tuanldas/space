/* eslint-disable no-unused-vars */
import {
  createContext,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
  useState
} from 'react';
import { isAuthenticated as checkAuthenticated, type UserModel } from '@/auth';
import { callApiLogin } from '@/api/auth.tsx';

interface AuthContextProps {
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  currentUser: UserModel | undefined;
  isAuthenticated: boolean;
  setCurrentUser: Dispatch<SetStateAction<UserModel | undefined>>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | null>(null);

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<UserModel | undefined>();
  const [isAuthenticated, setIsAuthenticated] = useState(checkAuthenticated());

  const login = async (email: string, password: string) => {
    try {
      await callApiLogin({ email, password });
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
      throw new Error(`Error ${error}`);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(undefined);
  };

  return (
    <AuthContext.Provider
      value={{
        loading,
        setLoading,
        currentUser,
        isAuthenticated,
        setCurrentUser,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
