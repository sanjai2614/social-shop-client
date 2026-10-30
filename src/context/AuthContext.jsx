
import {
  createContext,
  useContext,
  useState,
} from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { getCurrentUser } from "../services/auth.service.js";
import { getAccessToken } from "../api/tokenHelper.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();

  const [hasToken, setHasToken] = useState(
    () => Boolean(getAccessToken()),
  );
  const [localUser, setLocalUser] = useState(null);

  const {
    data,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: getCurrentUser,
    enabled: hasToken,
    retry: false,
    staleTime: 0,
  });

  const user = hasToken
    ? (data?.user ?? localUser)
    : null;

  const setUser = (nextUser) => {
    setLocalUser(nextUser);
    setHasToken(Boolean(getAccessToken()));
  };

  const logout = () => {
    setLocalUser(null);
    setHasToken(false);
    queryClient.removeQueries({ queryKey: ["auth", "me"] });
  };

  const isAuthLoading =
    hasToken && isPending && !localUser;

  const value = {
    user,
    setUser,
    logout,
    isAuthenticated: Boolean(user),
    isAuthLoading,
    isAuthError: isError,
    authError: error,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuthContext must be used within AuthProvider",
    );
  }

  return context;
};
