import { get, post, put, del, patch, postForm } from "../api/apiHelper.js";
import {
  POSTS_URL,
  POST_LIKE_URL,
  POST_COMMENTS_URL,
  POST_SAVE_URL,
  SAVED_POSTS_URL,
  ADMIN_POSTS_URL,
ADMIN_POST_STATUS_URL,
ADMIN_COMMENTS_URL,
ADMIN_COMMENT_STATUS_URL,
POST_BY_ID_URL,
} from "../api/urlHelper.js";

// Posts
export const getPosts = (params = {}) => get(POSTS_URL, { params });

export const createPost = (formData) => postForm(POSTS_URL, formData);

export const deletePost = (postId) => del(POST_BY_ID_URL(postId));

// Update own post
export const updatePost = (postId, payload) => patch(POST_BY_ID_URL(postId), payload);

// Like / Unlike post
export const likePost = (postId) => put(POST_LIKE_URL(postId));

export const unlikePost = (postId) => del(POST_LIKE_URL(postId));

// Comments
export const getPostComments = (postId) => get(POST_COMMENTS_URL(postId));

// Create a comment for a post
export const createPostComment = (postId, payload) =>
  post(POST_COMMENTS_URL(postId), payload);

// Save / Unsave
export const savePost = (postId) => put(POST_SAVE_URL(postId));

export const unsavePost = (postId) => del(POST_SAVE_URL(postId));

// Get logged-in user's saved posts
export const getSavedPosts = () => get(SAVED_POSTS_URL);


// Admin: Get posts with search and pagination
export const getAdminPosts = (params = {}) => get(ADMIN_POSTS_URL, { params });

// Admin: Activate / deactivate a post
export const updateAdminPostStatus = (postId, isActive) =>
  patch(ADMIN_POST_STATUS_URL(postId), { isActive });

// Admin: Get comments with search and pagination
export const getAdminComments = (params = {}) => get(ADMIN_COMMENTS_URL, { params });

// Admin: Activate / deactivate a comment
export const updateAdminCommentStatus = (commentId, isActive) =>
  patch(ADMIN_COMMENT_STATUS_URL(commentId), { isActive });