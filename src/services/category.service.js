import { get, post, patch, del } from "../api/apiHelper.js";

import { CATEGORIES_URL } from "../api/urlHelper.js";

// Get categories
export const getCategories = async () => get(CATEGORIES_URL);

// Create category
export const createCategory = async (payload) => {
  return post(CATEGORIES_URL, payload);
};

// Update category
export const updateCategory = async (categoryId, payload) => {
  return patch(`${CATEGORIES_URL}/${categoryId}`, payload);
};

// Deactivate category
export const deleteCategory = async (categoryId) => {
  return del(`${CATEGORIES_URL}/${categoryId}`);
};
