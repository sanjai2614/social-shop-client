
import { get,post, put, patch, postForm, del } from "../api/apiHelper";

import {
  REELS_URL,
  REEL_BY_ID_URL,
  REEL_COMMENTS_URL,
  REEL_COMMENT_BY_ID_URL,
  REEL_LIKE_URL,
  ADMIN_REELS_URL,
  ADMIN_REEL_STATUS_URL,
  ADMIN_REEL_COMMENTS_URL,
  ADMIN_REEL_COMMENT_STATUS_URL,
} from "../api/urlHelper";

export const fetchReels = async (params = {}) => {
  return get(REELS_URL, { params });
};

export const createReel = async (formData) => {
  return postForm(REELS_URL, formData);
};

export const deleteReel = async (reelId) => {
  return del(REEL_BY_ID_URL(reelId));
};



export const likeReel = (reelId) =>
  put(REEL_LIKE_URL(reelId));

export const unlikeReel = (reelId) =>
  del(REEL_LIKE_URL(reelId));

export const getReelComments = (reelId, params = {}) =>
  get(REEL_COMMENTS_URL(reelId), { params });

export const createReelComment = (reelId, content) =>
  post(REEL_COMMENTS_URL(reelId), { content });


export const deleteReelComment = (reelId, commentId) =>
  del(REEL_COMMENT_BY_ID_URL(reelId, commentId));


// Admin: Fetch reels with search, status and pagination
export const getAdminReels = (params = {}) =>
  get(ADMIN_REELS_URL, { params });

// Admin: Activate or deactivate a reel
export const updateAdminReelStatus = (reelId, isActive) =>
  patch(ADMIN_REEL_STATUS_URL(reelId), { isActive });

// Admin: Fetch comments for reels with search, status and pagination
export const getAdminReelComments = (params = {}) =>
  get(ADMIN_REEL_COMMENTS_URL, { params });

export const updateAdminReelCommentStatus = (commentId, isActive) =>
  patch(ADMIN_REEL_COMMENT_STATUS_URL(commentId), { isActive });