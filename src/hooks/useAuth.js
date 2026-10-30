import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { loginUser, registerUser } from "../services/auth.service.js";
import { useAuthContext } from "../context/AuthContext.jsx";
import { setAccessToken, removeAccessToken } from "../api/tokenHelper.js";

const useAuth = () => {
  const { user, setUser, isAuthenticated,isAuthLoading } = useAuthContext();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  
const loginMutation = useMutation({
  mutationFn: loginUser,

  onSuccess: (response) => {
    if (!response?.accessToken || !response?.user) {
      throw new Error("Invalid login response from server");
    }

    setAccessToken(response.accessToken);
    setUser(response.user);

    queryClient.setQueryData(["auth", "me"], {
      success: true,
      user: response.user,
    });

    navigate("/", { replace: true });
  },
});


  const registerMutation = useMutation({
    mutationFn: registerUser,

    onSuccess: () => {
      navigate("/login", {
        state: { message: "Registration successful. Please log in." },
      });
    },
  });

  const logout = () => {
    removeAccessToken();
    setUser(null);
    queryClient.clear();
    navigate("/login", { replace: true });
  };

  return {
    user,
    setUser,
    isAuthenticated,
    isAuthLoading,

    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,

    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,

    logout,
  };
};

export default useAuth;
