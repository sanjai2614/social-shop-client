import { get, patch, put, del } from "../api/apiHelper.js";

import {
  USER_BY_ID_URL,
  UPDATE_PROFILE_URL,
  USERS_URL,
  FOLLOW_USER_URL,
  FOLLOWERS_URL,
  FOLLOWING_URL,
  ADMIN_USERS_URL,
  ADMIN_USER_STATUS_URL,
} from "../api/urlHelper.js";

// Get public user profile
export const getUserProfile = (userId) => get(USER_BY_ID_URL(userId));

// Update logged-in user's profile
export const updateUserProfile = (payload) => patch(UPDATE_PROFILE_URL, payload);

// Search users by query
export const searchUsers = (query) =>
  get(`${USERS_URL}/search`, {
    params: { q: query },
  });

// Follow a user     
export const followUser = (userId) => put(FOLLOW_USER_URL(userId));

// Unfollow a user
export const unfollowUser = (userId) => del(FOLLOW_USER_URL(userId));

// Get followers of a user
export const getFollowers = (userId) => get(FOLLOWERS_URL(userId));

// Get following of a user
export const getFollowing = (userId) => get(FOLLOWING_URL(userId));

// Admin: Get customers with search and pagination
export const getAdminUsers = (params = {}) =>
  get(ADMIN_USERS_URL, { params });

// Admin: Activate or deactivate a customer
export const updateAdminUserStatus = (userId, isActive) =>
  patch(ADMIN_USER_STATUS_URL(userId), { isActive });