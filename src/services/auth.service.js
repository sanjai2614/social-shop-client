import { post ,get} from "../api/apiHelper.js";
import { REGISTER_URL, LOGIN_URL, CURRENT_USER_URL, LOGOUT_URL } from "../api/urlHelper.js";

// Register new user
export const registerUser = (payload) => post(REGISTER_URL, payload);

// Login existing user
export const loginUser = (payload) => post(LOGIN_URL, payload);

// Get current user
export const getCurrentUser = () => get(CURRENT_USER_URL);

// Logout user
export const logoutUser = () => post(LOGOUT_URL);