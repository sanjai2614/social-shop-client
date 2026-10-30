import { get, post, patch, del } from "../api/apiHelper.js";

import { CART_URL, CART_ITEM_URL } from "../api/urlHelper.js";

// Get logged-in user's cart
export const getCart = async () => {
  return get(CART_URL);
};

// Add product to cart
export const addToCart = async (productId, quantity = 1) => {
  return post(CART_URL, { productId, quantity });
};

// Update cart item quantity
export const updateCartItem = async (productId, quantity) => {
  return patch(CART_ITEM_URL(productId), { quantity });
};

// Remove product from cart
export const removeCartItem = async (productId) => {
  return del(CART_ITEM_URL(productId));
};

// Clear all cart items
export const clearCart = async () => {
  return del(CART_URL);
};
