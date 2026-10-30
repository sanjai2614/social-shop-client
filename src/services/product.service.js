import {
  get,
  post,
  patch,
  del,
  postForm,
  patchForm,
} from "../api/apiHelper.js";

import { PRODUCTS_URL, PRODUCT_BY_ID_URL } from "../api/urlHelper.js";

// Get products with search, category and pagination filters
export const getProducts = async (params = {}) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, String(value));
    }
  });

  const url = query.toString()
    ? `${PRODUCTS_URL}?${query.toString()}`
    : PRODUCTS_URL;

  return get(url);
};

// Get single product by ID
export const getProductById = async (productId) => {
  return get(PRODUCT_BY_ID_URL(productId));
};

// Create product with uploaded image files
export const createProduct = async (formData) => {
  return postForm(PRODUCTS_URL, formData);
};

// Update product details and images
export const updateProduct = async (productId, formData) => {
  return patchForm(PRODUCT_BY_ID_URL(productId), formData);
};

// Deactivate product
export const deleteProduct = async (productId) => {
  return del(PRODUCT_BY_ID_URL(productId));
};
