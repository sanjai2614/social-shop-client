const ACCESS_TOKEN_KEY = "accessToken";

export const getAccessToken = () => {
  return sessionStorage.getItem(ACCESS_TOKEN_KEY);
};

export const setAccessToken = (token) => {
  if (!token) {
    throw new Error("Access token is required");
  }

  sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
};

export const removeAccessToken = () => {
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
};

export const hasAccessToken = () => {
  return Boolean(getAccessToken());
};
