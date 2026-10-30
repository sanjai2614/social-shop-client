import { get, post, patch } from "../api/apiHelper.js";

import {
  CHECKOUT_URL,
  DEMO_PAYMENT_URL,
  MY_ORDERS_URL,
  ORDER_BY_ID_URL,
  ADMIN_ORDERS_URL,
  UPDATE_ORDER_STATUS_URL,
} from "../api/urlHelper.js";

// Create pending order from cart
export const checkoutOrder = async (shippingAddress) => {
  return post(CHECKOUT_URL, { shippingAddress });
};

// Process demo payment
export const processDemoPayment = async (orderId, paymentResult) => {
  return post(DEMO_PAYMENT_URL, {
    orderId,
    paymentResult,
  });
};

// Get logged-in user's orders
export const getMyOrders = async () => {
  return get(MY_ORDERS_URL);
};

// Get a specific order
export const getOrderById = async (orderId) => {
  return get(ORDER_BY_ID_URL(orderId));
};

// Get all orders for admin
export const getAllOrders = async () => {
  return get(ADMIN_ORDERS_URL);
};

// Update order status
export const updateOrderStatus = async (orderId, orderStatus) => {
  return patch(UPDATE_ORDER_STATUS_URL(orderId), {
    orderStatus,
  });
};