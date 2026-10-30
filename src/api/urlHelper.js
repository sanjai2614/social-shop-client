
/* Auth URLs */
export const REGISTER_URL = "/auth/register";
export const LOGIN_URL = "/auth/login";
export const REFRESH_TOKEN_URL = "/auth/refresh";
export const LOGOUT_URL = "/auth/logout";
export const CURRENT_USER_URL = "/auth/me";

/* User URLs */
export const USERS_URL = "/users";
export const USER_BY_ID_URL = (userId) => `/users/${userId}`;
export const UPDATE_PROFILE_URL = "/users/me";
export const UPLOAD_AVATAR_URL = "/users/me/avatar";
export const CHANGE_PASSWORD_URL = "/users/change-password";
export const SAVED_POSTS_URL = "/users/saved-posts";
export const FOLLOWERS_URL = (userId) => `/users/${userId}/followers`;
export const FOLLOWING_URL = (userId) => `/users/${userId}/following`;
export const FOLLOW_USER_URL = (userId) => `/users/${userId}/follow`;

/* Product URLs */
export const PRODUCTS_URL = "/products";
export const PRODUCT_BY_ID_URL = (productId) => `/products/${productId}`;

/* Category URLs */
export const CATEGORIES_URL = "/categories";
export const CATEGORY_BY_ID_URL = (categoryId) => `/categories/${categoryId}`;

/* Post URLs */
export const POSTS_URL = "/posts";
export const POST_BY_ID_URL = (postId) => `/posts/${postId}`;
export const POST_LIKE_URL = (postId) => `/posts/${postId}/like`;
export const POST_SAVE_URL = (postId) => `/posts/${postId}/save`;
export const POST_COMMENTS_URL = (postId) => `/posts/${postId}/comments`;

/* Reel URLs */
export const REELS_URL = "/reels";
export const REEL_BY_ID_URL = (reelId) => `/reels/${reelId}`;

/* Reel interaction URLs */
export const REEL_LIKE_URL = (reelId) => `/reels/${reelId}/like`;
export const REEL_COMMENTS_URL = (reelId) => `/reels/${reelId}/comments`;

/* Comment URLs */
export const COMMENT_BY_ID_URL = (commentId) => `/comments/${commentId}`;
export const REEL_COMMENT_BY_ID_URL = (reelId, commentId) =>
  `/reels/${reelId}/comments/${commentId}`;

/* Notification URLs */
export const NOTIFICATIONS_URL = "/notifications";
export const NOTIFICATION_READ_URL = (notificationId) => `/notifications/${notificationId}/read`;
export const NOTIFICATIONS_READ_ALL_URL = "/notifications/read-all";

/* Cart URLs */
export const CART_URL = "/cart";
export const CART_ITEM_URL = (productId) => `/cart/${productId}`;

/* Order URLs */
export const ORDERS_URL = "/orders";
export const CHECKOUT_URL = "/orders/checkout";
export const DEMO_PAYMENT_URL = "/orders/payment/demo";
export const MY_ORDERS_URL = "/orders/my-orders";
export const ORDER_BY_ID_URL = (orderId) => `/orders/${orderId}`;

// Admin Order URLs
export const ADMIN_ORDERS_URL = "/orders/admin/all";
export const UPDATE_ORDER_STATUS_URL = (orderId) =>
  `/orders/admin/${orderId}/status`;

// Dashboard URLs
export const DASHBOARD_STATS_URL = "/dashboard/stats";

// Admin User URLs
export const ADMIN_USERS_URL = "/users/admin";
export const ADMIN_USER_STATUS_URL = (userId) => `/users/admin/${userId}/status`;

// Admin Post URLs
export const ADMIN_POSTS_URL = "/posts/admin";

export const ADMIN_POST_STATUS_URL = (postId) => `/posts/admin/${postId}/status`;

// Admin Comment URLs
export const ADMIN_COMMENTS_URL = "/comments/admin";

export const ADMIN_COMMENT_STATUS_URL = (commentId) => `/comments/admin/${commentId}/status`;

// Admin Reel URLs
export const ADMIN_REELS_URL = "/reels/admin";

export const ADMIN_REEL_STATUS_URL = (reelId) => `/reels/admin/${reelId}/status`;

// Admin Reel Comment URLs
export const ADMIN_REEL_COMMENTS_URL = "/reels/admin/comments";

export const ADMIN_REEL_COMMENT_STATUS_URL = (id) =>
  `/reels/admin/comments/${id}/status`;