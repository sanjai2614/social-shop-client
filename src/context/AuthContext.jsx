
import {
  createContext,
  useContext,
  useState,
} from "react";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import { getCurrentUser } from "../services/auth.service.js";
import api from "../api/axios.js";

import {
  getAccessToken,
  setAccessToken,
  removeAccessToken,
} from "../api/tokenHelper.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();

  const [hasToken, setHasToken] = useState(
    () => Boolean(getAccessToken()),
  );

  const [localUser, setLocalUser] = useState(null);

  // Restore session if access token is missing
  const {
    data: refreshData,
    isPending: isRefreshing,
    isError: isRefreshError,
  } = useQuery({
    queryKey: ["auth", "refresh"],
    queryFn: async () => {
      const { data } = await api.post("/auth/refresh");

      if (!data.accessToken) {
        throw new Error("Access token missing");
      }

      setAccessToken(data.accessToken);
      setHasToken(true);

      return data;
    },
    enabled: !hasToken,
    retry: false,
    staleTime: Infinity,
  });

  // Fetch current user after token is available
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
    ? data?.user ?? localUser
    : null;

  const setUser = (nextUser) => {
    setLocalUser(nextUser);
    setHasToken(Boolean(getAccessToken()));
  };

  const logout = () => {
    removeAccessToken();
    setLocalUser(null);
    setHasToken(false);

    queryClient.removeQueries({
      queryKey: ["auth"],
    });
  };

  const isAuthLoading =
    (!hasToken && isRefreshing) ||
    (hasToken && isPending && !localUser);

  const value = {
    user,
    setUser,
    logout,
    isAuthenticated: Boolean(user),
    isAuthLoading,
    isAuthError: isError || isRefreshError,
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
